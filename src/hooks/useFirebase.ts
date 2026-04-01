import { off, onValue, ref, set, update } from "firebase/database";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GameState } from "../context/types";
import { db } from "../lib/firebase";
import { compareVersions, getLocalSchemaVersion } from "../utils/versionCheck";

// Connection status type
type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

interface UseFirebaseOptions {
	gameHash: string;
	onStateSync?: (state: GameState) => void;
}

interface UseFirebaseReturn {
	status: ConnectionStatus;
	gameState: GameState | null;
	updateGameState: (updates: Partial<GameState>) => Promise<void>;
	initializeGame: (initialState: GameState) => Promise<void>;
	firebaseSchemaVersion: string | null;
}

export class VersionMismatchError extends Error {
	constructor(
		public localVersion: string,
		public remoteVersion: string,
	) {
		super(
			`Schema version mismatch: local ${localVersion} vs remote ${remoteVersion}`,
		);
		this.name = "VersionMismatchError";
	}
}

/**
 * Custom hook for managing Firebase Realtime Database connection for a specific game.
 *
 * Features:
 * - Subscribes only to the specific game by hash
 * - Automatic connection management
 * - Connection status tracking
 * - Cleanup on unmount
 */
export const useFirebase = ({
	gameHash,
	onStateSync,
}: UseFirebaseOptions): UseFirebaseReturn => {
	const [status, setStatus] = useState<ConnectionStatus>("connecting");
	const [gameState, setGameState] = useState<GameState | null>(null);
	const [firebaseSchemaVersion, setFirebaseSchemaVersion] = useState<
		string | null
	>(null);
	const gameRefPath = `games/${gameHash}`;
	const onStateSyncRef = useRef(onStateSync);
	const localSchemaVersion = getLocalSchemaVersion();

	// Keep the callback ref up to date
	useEffect(() => {
		onStateSyncRef.current = onStateSync;
	}, [onStateSync]);

	/**
	 * Subscribe to game state changes
	 */
	useEffect(() => {
		const gameRef = ref(db, gameRefPath);

		setStatus("connecting");

		const unsubscribe = onValue(
			gameRef,
			(snapshot) => {
				const data = snapshot.val();
				setStatus("connected");

				if (data) {
					setGameState(data);
					// Extract and store schema version from Firebase
					const remoteVersion = data.schemaVersion || "";
					setFirebaseSchemaVersion(remoteVersion);
					if (onStateSyncRef.current) {
						onStateSyncRef.current(data);
					}
				}
			},
			(error) => {
				console.error("Firebase subscription error:", error);
				setStatus("error");
			},
		);

		// Cleanup on unmount or gameHash change
		return () => {
			off(gameRef);
			unsubscribe();
		};
	}, [gameRefPath]);

	/**
	 * Update game state with partial updates
	 * Encodes data to be Firebase-safe before sending
	 */
	const updateGameState = useCallback(
		async (updates: Partial<GameState>): Promise<void> => {
			// Check version mismatch
			if (firebaseSchemaVersion !== null) {
							const versionMatch = compareVersions(
								localSchemaVersion,
								firebaseSchemaVersion,
							);
							if (!versionMatch) {
								throw new VersionMismatchError(
									localSchemaVersion,
									firebaseSchemaVersion,
								);
							}
			}
			const gameRef = ref(db, gameRefPath);
			const timestamp = new Date().toISOString();

			try {
				await update(gameRef, {
					...updates,
					timestamp,
				});
			} catch (error) {
				console.error("Error updating game state:", error);
				throw error;
			}
		},
		[gameRefPath, firebaseSchemaVersion, localSchemaVersion],
	);

	/**
	 * Initialize a new game with the given state
	 * Encodes data to be Firebase-safe before sending
	 */
	const initializeGame = useCallback(
		async (initialState: GameState): Promise<void> => {
			const gameRef = ref(db, gameRefPath);
			const timestamp = new Date().toISOString();

			try {
				await set(gameRef, {
					...initialState,
					gameHash,
					timestamp,
				});
			} catch (error) {
				console.error("Error initializing game:", error);
				throw error;
			}
		},
		[gameRefPath, gameHash],
	);

	return {
		status,
		gameState,
		updateGameState,
		initializeGame,
		firebaseSchemaVersion,
	};
};
