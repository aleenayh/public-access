import { z } from "zod";
import { catchWithWarning } from "../utils/schemaValidation";	

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
	character: 
		z.unknown().nullable().catch(null), //TODO
});

export type Player = z.infer<typeof playerSchema>;

const safetySchema = z.object({
	lines: z.array(z.string()).optional().catch(undefined),
	veils: z.array(z.string()).optional().catch(undefined),
});

export const gameStateSchema = z.object({
	gameHash: z.string().catch(catchWithWarning("gameHash", "")),
	//no catchWithWarning for mysteries - empty array is valid, but dropped by firebase
	mysteries: z.array(z.unknown()).catch([]), //TODO
	players: z.array(playerSchema).catch(catchWithWarning("players", [])),
	timestamp: z.coerce.date().catch(catchWithWarning("timestamp", new Date())),
	safety: safetySchema.optional().catch(undefined),
	schemaVersion: z.string().catch(""),
});

export type GameState = z.infer<typeof gameStateSchema>;

export type UserInfo = z.infer<typeof userInfoSchema>;
