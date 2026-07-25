import { useState } from "react";
import { useGame } from "../../../context/GameContext";
import type { Advancements, Moves } from "../types";
import { adjustForMove, moves } from "../characterContent";
import { parseMarkupFromString } from "../../../utils/parseMarkupFromString";

export function EditMovesSection({ myMoves, onConfirm }: { myMoves: Moves[], onConfirm?:()=>void}) {
    const [isAdding, setIsAdding] = useState(false);
    return <div className="flex flex-col gap-2 w-full">
        <CurrentLatchkeyMoves canRemove myMoves={myMoves} />

        {!isAdding && <button type="button" className="formButton mx-auto my-6" onClick={() => setIsAdding(true)}>Add Move</button>}
        
        {isAdding && <AddMove onConfirm={() => {
            setIsAdding(false);
            onConfirm?.();
        }}/>}
    </div>
}

export function NewMoveOnAdvance({ onConfirm }: { onConfirm: () => void }) {
    const { gameState, user: { id } } = useGame();
    const character = gameState.players.find((player) => player.id === id)?.character
    if (!character) return;
    const myMoves = character.moves;
    const advancements = {
        ...character.advancements,
        ...(character.advancements.move1===true ? {move2:true} : {move1:true})
    };

    return <div className="flex flex-col gap-2 w-full">
        <CurrentLatchkeyMoves canRemove={false} myMoves={myMoves} />
        <AddMove onConfirm={onConfirm} advancements={advancements} />
</div>
}

function CurrentLatchkeyMoves({ canRemove, myMoves }: { canRemove: boolean,myMoves: Moves[]  }) {
    const { gameState, updateGameState, user } = useGame();
    const removeMove = (moveKey: string) => {
        const existingCharacter = gameState.players.find((player) => player.id === user.id)?.character
        if (!existingCharacter) return;
        const newMoves = existingCharacter.moves.filter((move) => move.name !== moveKey)
        const newCharacter = {
                ...existingCharacter,
                moves: newMoves
        }
        updateGameState({
                ...gameState,
                players: gameState.players.map((player) => player.id === user.id ? { ...player, character: newCharacter } : player),
        });
    }
    
    return <>
    <h4 className="text-center text-theme-text-accent">Current Latchkey Moves</h4>
    <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-4 align-start">
        {myMoves.map(({ name, description }) => (
    <div key={`move-${name}`} className={`border border-theme-border box-border rounded-md p-2 h-fit bg-theme-bg-primary max-h-64 overflow-y-auto`}>
        <h4 className={`text-theme-text-accent`}>{name}</h4>
                <p className="text-xs text-theme-text-secondary text-left">{parseMarkupFromString(description)}</p>
                {canRemove && <button type="button" onClick={() => removeMove(name)} className="formButton my-2 text-sm">Remove</button>}
    </div>
)
)}
    </div>
    </>
}

function AddMove({ onConfirm, advancements }: { onConfirm: () => void, advancements?: Advancements }) {
    const { gameState, updateGameState, user } = useGame();
    const movesInPlay = gameState.players.flatMap((player) => player.character?.moves || []).map((move) => move.name);
    const [selectedMove, setSelectedMove] = useState<string>("");

    const addMove = () => {
        const existingCharacter = gameState.players.find((player) => player.id === user.id)?.character
        if (!existingCharacter) return;
        const move = { name: selectedMove, description: moves[selectedMove].join("\n") }
        if (!move) return;
        const newMoves = [...existingCharacter.moves, move];
        const data = adjustForMove(selectedMove);
        let newAbilities = existingCharacter.abilities
        if (data && data.abilities) {
            newAbilities = {
                vitality: newAbilities.vitality + data.abilities.vitality,
                composure: newAbilities.composure + data.abilities.composure,
                reason: newAbilities.reason + data.abilities.reason,
                presence: newAbilities.presence + data.abilities.presence,
                sensitivity: newAbilities.sensitivity + data.abilities.sensitivity,
            }
        }
            let newCornerOfTheHouse = existingCharacter.cornerOfTheHouse
            if (data && data.cornerOfTheHouse) {
                newCornerOfTheHouse = [...newCornerOfTheHouse, ...data.cornerOfTheHouse]
            }
            const newCharacter = {
                ...existingCharacter,
                ...(advancements ? { advancements } : {}),
                moves: newMoves, abilities: newAbilities, cornerOfTheHouse: newCornerOfTheHouse
            }
            updateGameState({
                ...gameState,
                players: gameState.players.map((player) => player.id === user.id ? { ...player, character: newCharacter } : player),
            });
        onConfirm();
    }

    return <>
        <h4 className="text-center text-theme-text-accent">Add A Move</h4>
    <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-4 align-start">
        {Object.entries(moves).map(([name, description]) => {
            if (movesInPlay.includes(name)) {
                return null;
            }
            return (
                <button type="button" key={`move-${name}`} onClick={() => setSelectedMove(name)} className={`border border-theme-border box-border rounded-md p-2 h-fit bg-theme-bg-primary max-h-64 overflow-y-auto ${selectedMove === name ? "border-theme-border-accent border-2 shadow-lg bg-theme-bg-secondary" : ""}`}>
                    <h4 className={`text-theme-text-accent ${selectedMove === name ? "brightness-125" : ""}`}>{name}</h4>
                    <p className="text-xs text-theme-text-secondary text-left">{parseMarkupFromString(description.map((d) => d.trim()).join("\n"))}</p>
                </button>
            )
        })}
    </div>
        <button type="button" onClick={addMove} className="formButton mx-auto my-6">Confirm Add</button>
    </>
}