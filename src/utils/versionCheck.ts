/**
 * Version checking utilities for schema version protection
 */

/**
 * Get the local schema version from environment variable
 * Falls back to empty string if not set
 */
export function getLocalSchemaVersion(): string {
	return import.meta.env.VITE_SCHEMA_VERSION || "";
}

/**
 * Compare two semantic versions
 * Returns true if versions match exactly, false otherwise
 * Any mismatch (even patch level) triggers protection
 */
export function compareVersions(local: string, remote: string): boolean {
// Default to blocking if either version is empty or missing
if (!local || !remote) {
	return false;
}

// Parse semantic versions by splitting on dots
const localParts = local.split(".").map((part) => {
	const num = Number.parseInt(part, 10);
	return Number.isNaN(num) ? -1 : num;
});

const remoteParts = remote.split(".").map((part) => {
	const num = Number.parseInt(part, 10);
	return Number.isNaN(num) ? -1 : num;
});

// If parsing failed (contains non-numeric parts), default to blocking
if (
	localParts.some((part) => part === -1) ||
	remoteParts.some((part) => part === -1)
) {
	return false;
}

// If versions have different segment counts, default to blocking
if (localParts.length !== remoteParts.length) {
	return false;
}

// Compare versions segment by segment
for (let i = 0; i < localParts.length; i++) {
	if (localParts[i] < remoteParts[i]) {
		// Local is older, should block
		return false;
	}
	if (localParts[i] > remoteParts[i]) {
		// Local is newer, allow overwrite
		return true;
	}
}

// Versions are equal, allow (no blocking needed)
return true;
}
