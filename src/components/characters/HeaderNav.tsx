import { Pizza } from "../svgs/portraitIcons/Pizza"
import { Casette } from "../svgs/portraitIcons/Casette"
import { Arcade } from "../svgs/portraitIcons/Arcade"
import { Cactus } from "../svgs/portraitIcons/Cactus"
import { Invader } from "../svgs/portraitIcons/Invader"
import { D20 } from "../svgs/portraitIcons/D20"
import { Lizard } from "../svgs/portraitIcons/Lizard"
import type { Character, FallbackImage } from "./types"
import { useGame } from "../../context/GameContext"


export function HeaderNav({activeCharacter, setActiveCharacter}: {activeCharacter:string | null, setActiveCharacter: (characterName: string) => void}) {
    const {gameState} = useGame();
    const allCharacters = gameState.players.map((player) => player.character).filter((character) => character !== null);

    const handleClick= (character: Character) => {
        setActiveCharacter(character.name);
    }

    return (
        <div className="flex items-center justify-evenly max-h-24">
            {allCharacters.map((character, index) => (
				<CharacterPortrait 
                isActive={activeCharacter !== "overview" && activeCharacter === character.name}
				key={character.name}
            	characterIndex={index}
                onClick={() => handleClick(character)}
				character={character}
				/>
			))}
        </div>
    )

}


function CharacterPortrait({characterIndex, character, onClick, isActive}: {characterIndex: number, character: Character, onClick: (characterName: string) => void, isActive: boolean}) {
    const gradient = `linear-gradient(to right, hsl(${(characterIndex*50)}deg, 100%, 50%), hsl(${(characterIndex*50 + 100)}deg, 100%, 50%))`
    const color = `hsl(${characterIndex*50 + 180}deg, 100%, 50%)`

    //TODO: this is where we add the chromatic desert effect

    return (
    <button type="button" className="isolate relative flex items-center justify-center max-h-24 aspect-square flex-col" onClick={() => onClick(character.name)}>
        <div className={`w-full h-full flex items-center justify-center border-2 ${isActive ? "scale-110 saturate-100" : "saturate-[0.2]"} rounded-sm p-1 aspect-square hover:brightness-110 hover:saturate-100 transition-brightness duration-300 hover:-translate-y-6`} style={{background: gradient, color}}>
            {character.image.type === "custom" ? <img src={character.image.url} alt={character.name} className="w-full h-full object-cover"/> : getFallbackIcon(character.image)}
            </div>
            <p className="absolute bottom-0 -z-1 text-center text-theme-text-accent text-xs whitespace-nowrap max-w-24 truncate">{character.name}</p>
    </button>
    )
}

function getFallbackIcon(image: FallbackImage) {
		switch (image.icon) {
			case "pizza":
				return <Pizza height={96} />;
			case "casette":
				return <Casette height={96} />;
			case "arcade":
				return <Arcade height={96} />;
			case "cactus":
                return <Cactus height={96} />;  
            case "invader":
                return <Invader height={96} />;
            case "d20":
                return <D20 height={96} />;
            case "lizard":
                return <Lizard height={96} />;
			default:
				return <Pizza height={96} />;
		}
	}