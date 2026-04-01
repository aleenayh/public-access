import { initializeApp } from "firebase/app"
import { get, getDatabase, ref, set } from "firebase/database"
import { defaultGameState } from "../context/defaults"
import { type GameState, PlayerRole } from "../context/types"

// Firebase configuration 
const firebaseConfig = {
  apiKey: "AIzaSyBypcN150wQra5eueiMS05yi-uC3ZqPGVg",
  authDomain: "public-access-9b077.firebaseapp.com",
  databaseURL: "https://public-access-9b077-default-rtdb.firebaseio.com",
  projectId: "public-access-9b077",
  storageBucket: "public-access-9b077.firebasestorage.app",
  messagingSenderId: "452283119072",
  appId: "1:452283119072:web:8764154615d1c5477fa785"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Export database instance for use across the app
export const db = getDatabase(app)

/**
 * Check if a game exists in Firebase and return its data
 */
export async function checkGameExists(gameHash: string): Promise<{ exists: boolean; gameState: GameState | null }> {
  console.log("Checking if game exists:", gameHash)
  const gameRef = ref(db, `games/${gameHash}`)

  try {
    // Add timeout to detect permission issues (Firebase hangs on denied permissions)
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Firebase request timed out - check database rules"))
      }, 10000)
    })

    const snapshot = await Promise.race([get(gameRef), timeoutPromise])
    console.log("Snapshot received:", snapshot.exists())

    if (snapshot.exists()) {
      return { exists: true, gameState: snapshot.val() }
    }
    return { exists: false, gameState: null }
  } catch (error) {
    console.error("Firebase error:", error)
    throw error
  }
}

/**
 * Get list of player names from a game
 */
export async function getGamePlayers(gameHash: string): Promise<{ id: string; name: string }[]> {
  const result = await checkGameExists(gameHash)
  if (!result.exists || !result.gameState) {
    return []
  }
  return result.gameState.players.map((p) => ({ id: p.id, name: p.name }))
}

/**
 * Create a new game in Firebase
 */
export async function createNewGame(gameHash: string, player: { id: string; name: string }): Promise<GameState> {
  const gameRef = ref(db, `games/${gameHash}`)
  const newState: GameState = {
    ...defaultGameState,
    gameHash,
    players: [
      {
        id: player.id,
        name: player.name,
        lastRoll: null,
        role: PlayerRole.PLAYER,
        character: null,
      },
    ],
  }

  await set(gameRef, {
    ...newState,
    timestamp: new Date().toISOString(),
  })

  return newState
}

/**
 * Generate a random game hash
 */
export function generateGameHash(): string {
  return Math.random().toString(36).substring(2, 10)
}

/**
 * Reset a game to default state (keeps the same hash, clears all players/progress)
 * Used for debugging
 */
export async function resetGameToDefaults(gameHash: string): Promise<GameState> {
  const gameRef = ref(db, `games/${gameHash}`)
  const newState: GameState = {
    ...defaultGameState,
    gameHash,
  }

  await set(gameRef, {
    ...newState,
    timestamp: new Date().toISOString(),
  })

  return newState
}

/**
 * Convert a display name to a player ID
 * - Lowercase
 * - Replace spaces with dashes
 * - Remove special characters
 */
export function nameToPlayerId(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}
