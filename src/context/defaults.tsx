import { getLocalSchemaVersion } from "../utils/versionCheck";
import type { GameState, Mystery } from "./types";

const tvOdysseyMystery: Mystery = {
	id: "tv-odyssey-mystery",
	name: "The TV Odyssey Mystery",
	clues: [],
	questions: [{text: "What happened to TV Odyssey?", complexity: 8}],
};

export const defaultGameState: GameState = {
	gameHash: "",
	players: [],
	timestamp: new Date(),
	safety: {
		lines: [],
		veils: [],
	},
	odysseyTapes: [],
	mysteries: [tvOdysseyMystery],
	schemaVersion: getLocalSchemaVersion(),
};
