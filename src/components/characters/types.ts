import { z } from "zod";

const providedImageSchema = z.object({
    type: z.literal("custom"),
    url: z.string(),
});
const defaultImageSchema = z.object({
    type: z.literal("default"),
    icon: z.string().catch("arcade"),
})
export type FallbackImage = z.infer<typeof defaultImageSchema>;

const abilitiySchema = z.object({
    vitality: z.number().catch(0),
    composure: z.number().catch(1),
    reason: z.number().catch(1),
    presence: z.number().catch(0),
    sensitivity: z.number().catch(-1),
});

const moveSchema = z.object({ name: z.string().catch("Move"), description: z.string().catch("description") })

export type Moves = z.infer<typeof moveSchema>;

export const characterSchema = z.object({
	name: z.string().catch(""),
    pronouns: z.string().optional().catch(undefined),
    conditions: z.array(z.string().catch("")).catch(["","",""]),
    cornerOfTheHouse: z.array(z.object({marked: z.boolean().catch(false), item: z.string().catch("")})).catch([{marked: false, item: ""}, {marked: false, item: ""}]),
    xp: z.array(z.boolean().catch(false)).catch([false, false, false, false, false, false]),
	look: z.string().catch(""),
    takesYouBack: z.string().catch(""),
	image: providedImageSchema.or(defaultImageSchema).catch({type: "default", icon: "arcade"}),
	abilities: abilitiySchema,
    moves: z.array(moveSchema).catch([]),
	questions: z.array(z.boolean()).catch([true, false, false, false, false, false, false]),
    keysOfTheChild: z.array(z.boolean()).catch([false, false, false, false, false]),
    keysOfDesolation: z.array(z.boolean()).catch([false, false, false, false, false]),
});

export type Character = z.infer<typeof characterSchema>;