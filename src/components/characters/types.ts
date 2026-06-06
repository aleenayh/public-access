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

export const characterSchema = z.object({
	name: z.string().catch(""),
    pronouns: z.string().optional().catch(undefined),
	look: z.string().catch(""),
    takesYouBack: z.string().catch(""),
	image: providedImageSchema.or(defaultImageSchema).catch({type: "default", icon: "arcade"}),
	abilities: abilitiySchema,
    moves: z.array(z.object({name: z.string().catch("Move"), description: z.string().catch("description")})).catch([]),
	questions: z.array(z.boolean()).catch([false, false, false, false, false]),
    keysOfTheChild: z.array(z.boolean()).catch([false, false, false, false, false]),
    keyOfDesolation: z.array(z.boolean()).catch([false, false, false, false, false]),
});

export type Character = z.infer<typeof characterSchema>;