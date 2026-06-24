import { z } from "zod";
import { catchWithWarning } from "../utils/schemaValidation";	
import { characterSchema } from "../components/characters/types";

export const PlayerRole = {
	KEEPER: "keeper",
	PLAYER: "player",
} as const;

export const userInfoSchema = z.object({
	id: z.string(),
	name: z.string(),
	role: z.enum([PlayerRole.KEEPER, PlayerRole.PLAYER]),
});

const abilityKeys = {
	vitality: "vitality",
	sensitivity: "sensitivity",
	composure: "composure",
	reason: "reason",
	presence: "presence",
} as const;

const rollSchema = z.object({
	roll: z.number().catch(0),
	type: z.enum(Object.keys(abilityKeys)).catch(abilityKeys.vitality),
	timestamp: z.coerce.date().catch(new Date()),
});

const playerSchema = z.object({
	id: z.string(),
	name: z.string(),
	lastRoll: rollSchema.nullable().catch(null),
	role: z
		.enum([PlayerRole.KEEPER, PlayerRole.PLAYER])
		.catch(catchWithWarning("player.role", PlayerRole.PLAYER)),
	//no warning - null character is valid but dropped by firebase
	character:characterSchema.nullable().catch(null),
});

export type Player = z.infer<typeof playerSchema>;

const safetySchema = z.object({
	lines: z.array(z.string()).optional().catch(undefined),
	veils: z.array(z.string()).optional().catch(undefined),
});

const questionSchema = z.object({
	text: z.string().catch(""),
	complexity: z.number().min(1).max(16).catch(6),
	opportunity: z.string().optional().catch(undefined),
})

const clueSchema = z.object({
	used: z.boolean().catch(false),
	text: z.string().catch("")
});

const mysterySchema = z.object({
	id: z.string(),
	name: z.string().catch("Mystery"),
	intro: z.array(z.string()).optional().catch(undefined),
	clues: z.array(clueSchema).catch([]),
	customKey: z.object({checked: z.boolean().catch(false), title: z.string().catch(""), text: z.string().catch("")}).optional().catch(undefined),
	questions: z.array(questionSchema).catch([]),
});

export type Mystery = z.infer<typeof mysterySchema>;

const odysseyTapeSchema = z.object({
	watched: z.boolean().catch(false),
	title: z.string(),
	intro: z.array(z.string()).catch([""]),
	prompts: z.array(z.string()).catch([""]),
});

export type OdysseyTape = z.infer<typeof odysseyTapeSchema>;

export const gameStateSchema = z.object({
	gameHash: z.string().catch(catchWithWarning("gameHash", "")),
	//no catchWithWarning for mysteries - empty array is valid, but dropped by firebase
	mysteries: z.array(mysterySchema).catch([]),
	odysseyTapes: z.array(odysseyTapeSchema).catch([]),
	players: z.array(playerSchema).catch(catchWithWarning("players", [])),
	timestamp: z.coerce.date().catch(catchWithWarning("timestamp", new Date())),
	safety: safetySchema.optional().catch(undefined),
	schemaVersion: z.string().catch(""),
});

export type GameState = z.infer<typeof gameStateSchema>;

export type UserInfo = z.infer<typeof userInfoSchema>;
