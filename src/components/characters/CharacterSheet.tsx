import { useGame } from "../../context/GameContext";
import { AbilityBoxes } from "./components/AbilityBoxes";
import { Conditions } from "./components/Conditions";
import { CornerOfTheHouse } from "./components/CornerOfTheHouse";
import { Keys } from "./components/Keys";
import { Questions } from "./components/Questions";
import { LatchkeyMoves } from "./components/LatchkeyMoves";
import type { Character } from "./types";
import { EditCharacterModal } from "./components/EditModal";

export function CharacterSheet({character}: {character: Character}) {
    const {gameState, user: {id}} = useGame();
    const activePlayer = gameState.players.find((player) => player.character?.name === character.name);
    const editable = activePlayer?.id === id;

    return (
        <div key={character.name} className="flex flex-col gap-2 flex-1 w-full max-h-full min-h-0 overflow-y-scroll scrollbar-gutter-stable pb-20 fadeInEachChild">
        <h3 className="text-theme-text-primary sticky top-0 bg-theme-bg-primary rounded-bl-md rounded-br-md w-fit mx-auto px-2 text-xl z-2 ">{character.name}</h3>
        <p className="text-xs text-theme-text-muted/80 text-center"><span className="italic">{character.pronouns}</span> | Played by {activePlayer?.name}</p>
        <Conditions character={character}/>

        <AbilityBoxes character={character}/>
        <div className="flex gap-2">
        <CornerOfTheHouse character={character}/>
            <LatchkeyMoves character={character}/>
            </div>
        <Questions character={character}/>
        <Keys character={character}/>

        <p className="text-left"><strong className="text-theme-text-accent">Look:</strong> {character.look}</p>
            <p className="text-left"><strong className="text-theme-text-accent">Takes You Back:</strong> {character.takesYouBack}</p>
            {editable && <EditCharacterModal character={character} />}
        </div>
    )
}