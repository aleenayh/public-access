import type { $ZodCatchCtx } from "zod/v4/core"
import { defaultGameState } from "../context/defaults"
import { type GameState, gameStateSchema } from "../context/types"

/**
 * Schema validation utilities for handling data format changes during playtesting.
 * Uses Zod's .catch() to preserve valid data and only replace invalid nested fields with defaults.
 */

export type ValidationWarning = {
  field: string
  expected: string
  received: string
}

/**
 * Module-level collector for warnings from .catch() callbacks.
 * Cleared before each validation run.
 */
let catchWarnings: ValidationWarning[] = []

/**
 * Creates a .catch() callback that logs warnings when fallback values are used.
 * Use this instead of plain .catch(defaultValue) to track silent fallbacks.
 *
 * @example
 * // Instead of: z.boolean().catch(false)
 * // Use: z.boolean().catch(catchWithWarning("player.online", false))
 */
export function catchWithWarning<T>(field: string, defaultValue: T) {
  return (ctx: $ZodCatchCtx): T => {
    const errorMessages = ctx.error.issues.map((i) => i.message).join(", ")
    catchWarnings.push({
      field,
      expected: errorMessages,
      received: JSON.stringify(ctx.input),
    })
    return defaultValue
  }
}

/**
 * Clears the catch warnings collector. Call before starting a new validation.
 */
export function clearCatchWarnings(): void {
  catchWarnings = []
}

/**
 * Returns a copy of the current catch warnings.
 */
export function getCatchWarnings(): ValidationWarning[] {
  return [...catchWarnings]
}

export function validateGameState(state: unknown): {
  state: GameState
  warnings: ValidationWarning[]
} {
  const warnings: ValidationWarning[] = []

  if (!state || typeof state !== "object") {
    warnings.push({
      field: "state",
      expected: "object",
      received: typeof state,
    })
    return { state: defaultGameState, warnings }
  }

  // Clear catch warnings before parsing
  clearCatchWarnings()

  // Parse with the schema - .catch() callbacks will collect warnings
  const result = gameStateSchema.safeParse(state)

  // Collect any warnings from .catch() callbacks
  warnings.push(...getCatchWarnings())

  if (result.success) {
    if (warnings.length > 0) {
      console.warn("[Schema Validation] Data recovered with fallbacks:", warnings)
    }
    return { state: result.data, warnings }
  }

  // If parsing still failed, collect the remaining errors
  for (const issue of result.error.issues) {
    const received = "received" in issue ? JSON.stringify(issue.received).slice(0, 100) : "unknown"
    warnings.push({
      field: issue.path.join("."),
      expected: issue.message,
      received,
    })
  }

  console.error("[Schema Validation] Failed to parse game state:", warnings)
  return { state: defaultGameState, warnings }
}
