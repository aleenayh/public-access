import { useGame } from "../../context/GameContext";
import { Keys } from "./components/Keys";
import type { Character } from "./types";

export function CharacterSheet({character}: {character: Character}) {
    const {gameState} = useGame();
    const activePlayer = gameState.players.find((player) => player.character?.name === character.name);

    return (
        <div key={character.name} className="flex flex-col gap-2 flex-1 w-full overflow-y-auto pb-20 fadeInEachChild">
        <h3 className="text-theme-text-primary sticky top-0 bg-theme-bg-primary rounded-bl-md rounded-br-md w-fit mx-auto px-2 text-xl">{character.name}</h3>
        <p className="text-xs text-theme-text-muted/80 text-center"><span className="italic">{character.pronouns}</span> | Played by {activePlayer?.name}</p>
        <div className="h-24 w-full border border-theme-border rounded-md"> 			
            <p>Conditions</p>
        </div>

        <div className="h-24 w-full border border-theme-border rounded-md"> 	
        <p>Ability Boxes</p>
        </div>
        <div className="flex gap-2 h-36">
        <div className="flex-1 border border-theme-border rounded-md"><p>Your Corner of the House</p></div>
        <div className="flex-1 border border-theme-border rounded-md"><p>Latchkey Moves</p></div>
        </div>

        <p className="h-24">Questions & XP</p>
        Did the Latchkeys resolve a mystery? 
Did you receive a Signal from the Other Side? (Locked until you mark The Sandstone Arch)
Did you share a good memory from your childhood? 
Were you vulnerable with someone? 
Did you go out of your way to reconnect with Deep Lake? 
Did you deliver a chilling monologue about something that happened to you in the past?
Did you cut loose for once?  

        <Keys character={character}/>

        <p className="text-left"><strong className="text-theme-text-accent">Look:</strong> {character.look}</p>
        <p className="text-left"><strong className="text-theme-text-accent">Takes You Back:</strong> {character.takesYouBack}</p>
        </div>
    )
}