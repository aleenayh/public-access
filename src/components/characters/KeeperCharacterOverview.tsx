import { useState } from "react";
import { useGame } from "../../context/GameContext"
import { Conditions } from "./components/Conditions";
import type { Character } from "./types";
import { Questions } from "./components/Questions";

export function KeeperCharacterOverview() {
    const { gameState } = useGame();
    const allCharacters = gameState.players.map((p) => p.character).filter((character): character is Character => Boolean(character));
    const [view, setView] = useState<"conditions"|"questions">("conditions")

    return (
        <div className="h-full overflow-auto">
            <h2>Keeper Character Overview</h2>
            <div className="flex gap-6 justify-center">
            <label htmlFor="conditions" className={`flex items-center gap-1 ${view === "conditions" ? "text-theme-text-accent font-bold" : "text-theme-text-primary"}`}><input id="conditions" type="radio" name="view" value="conditions" checked={view === "conditions"} onChange={() => setView("conditions")} />
                    Conditions</label>
                <label htmlFor="questions" className={`flex items-center gap-1 ${view === "questions" ? "text-theme-text-accent font-bold" : "text-theme-text-primary"}`}>
                    <input id="questions" type="radio" name="view" value="questions" checked={view === "questions"} onChange={() => setView("questions")} />
                   Dawn Questions</label>
            </div>
            
            <div className="grid grid-cols-2 gap-3 items-stretch">
                {allCharacters.map((character) => (<Overview character={character} view={view} />))}
                </div>
        </div>
    )
}

function Overview({ character,view }: { character: Character,view:"conditions"|"questions" }) {
    const { gameState } = useGame();
    const player = gameState.players.find((player)=> player.character?.name === character.name)?.name
    return <div className="flex flex-col justify-center items-center">
        <h4>{character.name}</h4>
        <p className="text-theme-text-muted text-xs italic">Played by {player}</p>
        <div className="grow w-full">
        {view === "conditions" && <Conditions character={character} />}
            {view === "questions" && <Questions character={character} />}
            </div>
        </div>
}