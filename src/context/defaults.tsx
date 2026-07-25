import { getLocalSchemaVersion } from "../utils/versionCheck";
import type { GameState, Mystery } from "./types";

//TODO get these from Jason
const tvOdysseyMystery: Mystery = {
	id: "tv-odyssey-mystery",
	name: "The TV Odyssey Mystery",
	clues: [],
	questions: [{text: "What happened to TV Odyssey?", complexity: 6}],
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
