import toast from "react-hot-toast";
import type { GameState } from "../context/types";

/**
 * download game state JSON file with given filename
 * @param gameState - game state to download
 * @param filename - filename to save the game state as...e.g. "PublicAccess-game-sdfg34d.json"
 */
export const downloadGameStateJSON = async (
	gameState: GameState,
	filename: string,
): Promise<void> => {
	try {
		const json = JSON.stringify(gameState, null, 2);
		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
		toast.success("Game File Downloaded!");
	} catch (error) {
		console.error("Error downloading game state JSON:", error);
		toast.error("Error downloading game file!");
	}
};
