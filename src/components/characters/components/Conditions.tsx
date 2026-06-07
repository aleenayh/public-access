import { useGame } from "../../../context/GameContext";
import { EditableLine } from "../../shared/EditableLine";
import type { Character } from "../types";

export function Conditions({character}: {character: Character}) {
    const {gameState, updateGameState, user: {id}} = useGame();
    const editable = gameState.players.find((player) => player.character?.name === character.name)?.id === id;

    const handleSave = (index: number, value: string) => {
        const conditions = character.conditions.map((condition, i) => i === index ? value : condition);
        updateGameState({
            ...gameState,
            players: gameState.players.map((player) => player.character && player.id === id ? { ...player, character: { ...player.character, conditions } } : player),
        });
    }
    return (
        <div className="flex flex-col gap-2 w-full border border-theme-border rounded-md p-1">
        <p>Conditions</p>
            <EditableLine text={character.conditions[0]} editable={editable} onSave={handleSave} index={0} />
            <EditableLine text={character.conditions[1]} editable={editable} onSave={handleSave} index={1} />
            <EditableLine text={character.conditions[2]} editable={editable} onSave={handleSave} index={2} />
        </div>
    )
}