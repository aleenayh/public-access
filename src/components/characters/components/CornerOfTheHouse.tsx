import { useGame } from "../../../context/GameContext";
import { CheckableEditableLine } from "../../shared/EditableLine";
import type { Character } from "../types";

export function CornerOfTheHouse({character}: {character: Character}) {
    const {gameState, updateGameState, user: {id}} = useGame();
    const editable = gameState.players.find((player) => player.character?.name === character.name)?.id === id;

    const handleSave = (index: number, value: string) => {
        const conditions = character.conditions.map((condition, i) => i === index ? value : condition);
        updateGameState({
            ...gameState,
            players: gameState.players.map((player) => player.character && player.id === id ? { ...player, character: { ...player.character, conditions } } : player),
        });
    }

    const handleCheck = (index: number, checked: boolean) => {
        const cornerOfTheHouse = character.cornerOfTheHouse.map((item, i) => i === index ? { ...item, marked: checked } : item);
        updateGameState({
            ...gameState,
            players: gameState.players.map((player) => player.character && player.id === id ? { ...player, character: { ...player.character, cornerOfTheHouse } } : player),
        });
    }

    const cornerOfTheHouse = character.cornerOfTheHouse
    
    return (
        <div className="flex-1 flex flex-col gap-2 w-full border border-theme-border rounded-md px-2 pb-2">
            <p>Your Corner of the House</p>
            {Array.from({length: Math.max(2, cornerOfTheHouse.length +1)}
        ).map((_, index) => {
            const data = cornerOfTheHouse[index] || { marked: false, item: "" };
									return <CheckableEditableLine
										key={`cornerOfTheHouse-${index}`}
										text={data.item}
										editable={editable}
										onSave={handleSave}
										onCheck={handleCheck}
										checked={data.marked}
										index={index}
									/>
								})}
        </div>
    )
}