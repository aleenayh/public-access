import { parseMarkupFromString } from "../../../utils/parseMarkupFromString";
import type { Character } from "../types";

export function LatchkeyMoves({character}: {character: Character}) {
    return (
        <div className="flex-1 flex flex-col gap-2 w-full border border-theme-border rounded-md px-2 pb-2">
            <p>Latchkey Moves</p>
            {character.moves.map((move) => {
                return <div key={`move-${move.name}`}>
                    <h4 className="text-theme-text-accent">{move.name}</h4>
                    <p className="text-xs text-theme-text-secondary text-left">{parseMarkupFromString(move.description)}</p>
                </div>
            })}
        </div>
    )
}