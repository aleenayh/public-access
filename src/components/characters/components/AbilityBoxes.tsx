import { useGame } from "../../../context/GameContext";
import type { Character } from "../types";

export function AbilityBoxes({character}: {character: Character}) {
    const {gameState, updateGameState, user: {id}} = useGame();
    const canRoll = gameState.players.find((player) => player.character?.name === character.name)?.id === id;

    return (
        <div className="flex gap-2">
            {Object.keys(character.abilities).map((ability) => {
									const score =
										character.abilities[
											ability as keyof typeof character.abilities
										];
									return (
										<div
											key={ability}
											className="flex-1 border border-theme-border rounded-md"
										>
											<p className="font-bold text-xs">
												<abbr title={ability.toUpperCase()}>
													{ability.slice(0, 4).toUpperCase()}
												</abbr>
											</p>
											<p className="text-md text-center text-theme-text-accent">
												{score}
											</p>
										</div>
									);
								})}
        </div>
    )
}