import { useGame } from "../../../context/GameContext";
import type { Character } from "../types";
import { AdvancementModal } from "./AdvancementModal";

export function Questions({character}: {character: Character}) {
    const {gameState, updateGameState, user: {id}} = useGame();
    const editable = gameState.players.find((player) => player.character?.name === character.name)?.id === id;

    const questions = [
        "Did the Latchkeys resolve a mystery?",
        "Did you receive a Signal from the Other Side?",
        "Did you share a good memory from your childhood?",
        "Were you vulnerable with someone?",
        "Did you go out of your way to reconnect with Deep Lake?",
        "Did you deliver a chilling monologue about something that happened to you in the past?",
        "Did you cut loose for once?",
    ];

    const handleSave = (index: number) => {
        const questions = [...character.questions];
        questions[index] = !character.questions[index];
        updateGameState({
            ...gameState,
            players: gameState.players.map((player) => player.character && player.id === id ? { ...player, character: { ...player.character, questions } } : player),
        });
    }
    return (
        <div className="flex gap-2 w-full border border-theme-border rounded-md px-2 justify-between">
        <div className="flex-6 flex flex-col gap-2 pb-2">
            <p>Dawn Questions</p>
            {questions.map((question, index) => {
                const checked = index === 0 || (index === 1 && character.keysOfDesolation[0]) || character.questions[index];
                const showLockedMsg = index === 1 && !character.keysOfDesolation[0];
                return (
                <div key={`question-${index}`} className="flex gap-1 text-xs text-left items-baseline">
                    <input type="checkbox" className="relative top-[0.5px]"checked={checked} onChange={() => handleSave(index)} disabled={!editable || index === 0 || index === 1}/>
                    <p>{question} {showLockedMsg && <span className="text-xs text-theme-text-muted/80 text-left italic">(Locked until you mark The Sandstone Arch)</span>}</p>
                </div>
            )})}
        </div>
        <XP character={character}/>
        </div>
    )
}

function XP({character}: {character: Character}) {
    const {gameState, updateGameState, user: {id}} = useGame();
    const editable = gameState.players.find((player) => player.character?.name === character.name)?.id === id;

    const handleSave = (index: number, value: boolean) => {
        const xp = character.xp.map((xp, i) => i === index ? value : xp);
        updateGameState({
            ...gameState,
            players: gameState.players.map((player) => player.character && player.id === id ? { ...player, character: { ...player.character, xp } } : player),
        });
    }

    const showAdvanceTrigger = editable && character.xp.filter((Boolean)).length >= 6

    return (
        <div className="flex-1 flex flex-col gap-2 justify-start items-center py-2">
            <p>XP</p>
            {Array.from({length:6}).map((_, index) => {
                return (
                    <div key={`xp-${index}`} className="flex gap-1 text-xs text-left items-baseline">
                        <input type="checkbox" className="relative top-1" checked={character.xp[index]} onChange={(e) => handleSave(index, e.target.checked)} disabled={!editable}/>
                    </div>
                )
            })}
            {showAdvanceTrigger && <AdvancementModal/>}
        </div>
    )
}