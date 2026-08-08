import { useGame } from "../../../context/GameContext";
import { AbilityBox } from "../../shared/Dice";
import type { AbilityKey, Character } from "../types";

export function AbilityBoxes({character}: {character: Character}) {
    const {gameState, user: {id}} = useGame();
	const canRoll = gameState.players.find((player) => player.character?.name === character.name)?.id === id;

    return (
        <div className="flex gap-2 justify-center">
            {Object.keys(character.abilities).map((ability) => {
				const score = character.abilities[ability as AbilityKey]
				return <AbilityBox 
							ability={ability as AbilityKey}
							value={score}
							editable={canRoll}
							/>
			})}
        </div>
    )
}