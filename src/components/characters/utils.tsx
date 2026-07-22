import type { GameState } from "../../context/types";

export function getAllUnusedIcons(gameState: GameState) {
    const charactersWithIcons = gameState.players.flatMap((player) =>
        player.character?.image.type === "default" ? [player.character] : []
      );
    const usedIcons = charactersWithIcons.map((character) => character.image.type === "default" ? character.image.icon : undefined).filter((icon) => icon !== undefined);
    const fallbackIcons = ["pizza", "casette", "arcade", "cactus", "invader", "d20", "lizard"];
    const unusedIcons = fallbackIcons.filter((icon) => !usedIcons.includes(icon));
    return unusedIcons
}

export function getUnusedFallback(gameState: GameState) {
    const unusedIcons = getAllUnusedIcons(gameState);
    return {type: "default" as const, icon: unusedIcons[0]};
}