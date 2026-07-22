import {Dialog} from "radix-ui";
import { useState } from "react";
import {useForm } from "react-hook-form";   
import { useGame } from "../../../context/GameContext";
import { CloseButton } from "../../shared/CloseButton";
import { Divider } from "../../shared/Divider";
import { Pizza } from "../../svgs/portraitIcons/Pizza";
import { Casette } from "../../svgs/portraitIcons/Casette";
import { Cactus } from "../../svgs/portraitIcons/Cactus";
import { Invader } from "../../svgs/portraitIcons/Invader";
import { Arcade } from "../../svgs/portraitIcons/Arcade";
import { D20 } from "../../svgs/portraitIcons/D20";
import { Lizard } from "../../svgs/portraitIcons/Lizard";
import { getAllUnusedIcons } from "../utils";
import { parseMarkupFromString } from "../../../utils/parseMarkupFromString";
import { adjustForMove, moves } from "../characterContent";
import type { Character, Moves } from "../types";

type Img = {type: "custom", url: string} | {type: "default", icon: string}
type CharacterCreateInputs = {
    name: string;
    pronouns: string;
    look: string;
    image: Img;
    abilities: {
        vitality: number;
        sensitivity: number;
        composure: number;
        reason: number;
        presence: number;
    };
    takesYouBack: string;
}

export function EditCharacterModal({character}:{character:Character}) {
    const [isOpen, setIsOpen] = useState(false);
	return (
		<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            			<Dialog.Trigger asChild>
				<button type="button" className="formButton">Edit Latchkey</button>
			</Dialog.Trigger>
                    <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay" />
			<Dialog.Content className="DialogContent">
                <Dialog.Close asChild>
                    <CloseButton/>
                </Dialog.Close>
				<Dialog.Title className="DialogTitle">Edit Latchkey</Dialog.Title>
				<Dialog.Description className="sr-only">
                    Edit your character
                    </Dialog.Description>
                    <EditForm character={character} close={()=> setIsOpen(false)}/>
			</Dialog.Content>
            </Dialog.Portal>
		</Dialog.Root>
	);
}

function EditForm({ character, close }: { character: Character, close:()=>void }) {
    const { gameState, updateGameState, user } = useGame();
    let unusedIcons = getAllUnusedIcons(gameState);
    const { register, handleSubmit, setValue, watch } = useForm({ defaultValues: {
        name: character.name,
        pronouns: character.pronouns ?? "",
        look: character.look,
        image: character.image,
        moves: character.moves,
        abilities: {
            vitality: character.abilities.vitality,
            composure:   character.abilities.composure,
            reason: character.abilities.reason,
            presence: character.abilities.presence,
            sensitivity: character.abilities.sensitivity,
        },
        takesYouBack: character.takesYouBack,
    }
    });

    const [imageType, setImageType] = useState<"provided"| "custom">(character.image.type === "custom" ? "custom": "provided")

    if (character.image.type === "default") {
        unusedIcons = [...unusedIcons, character.image.icon]
    }
    const confirmCharacter = (data: CharacterCreateInputs) => {
        const { name, pronouns, look, image, abilities, takesYouBack } = data;
        const newCharacter = {
            ...character,
            name,
            pronouns,
            look,
            image,
            takesYouBack,
            abilities: {
                vitality: Number(abilities.vitality),
                composure: Number(abilities.composure),
                presence: Number(abilities.presence),
                reason: Number(abilities.reason),
                sensitivity: Number(abilities.sensitivity)
            }
        }
        updateGameState({
            ...gameState,
            players: gameState.players.map((player) => player.id === user.id ? { ...player, character: newCharacter } : player),
        });
        close();
    };

    const handleImgTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageType(e.target.value as "custom" | "provided")
    }
    const handleImageClick = (imageKey: string) => {
        setValue("image", {type: "default" as const, icon: imageKey})
    }
    const handleCustomImg = (e: React.ChangeEvent<HTMLInputElement>) => {
        const link = e.target.value;
        setValue("image", { type: "custom" as const, url: link })
    }
    
    return <form onSubmit={handleSubmit(confirmCharacter)}>
    <div className="flex flex-wrap text-center w-full gap-1">
    <label htmlFor="name" className="text-xs text-theme-text-muted/80 text-left italic">Latchkey Name</label>
        <input type="text" {...register("name")} className="w-full" />
        <label htmlFor="pronouns" className="text-xs text-theme-text-muted/80 text-left italic">Pronouns</label>
        <input type="text" {...register("pronouns")} className="w-full" />
        <label htmlFor="look" className="text-xs text-theme-text-muted/80 text-left italic">Look</label>
        <input type="text" {...register("look")} className="w-full" />
        <label htmlFor="takesYouBack" className="text-xs text-theme-text-muted/80 text-left italic">Takes You Back</label>
        <input type="text" {...register("takesYouBack")} className="w-full" />
        <Divider />
        <p>Character Image</p>
        <div className="flex justify-evenly w-full">
            <label htmlFor="customImg"><input type="radio" name="imageType" value="custom" id="customImg" onChange={handleImgTypeChange} checked={imageType === "custom"} /> Provide an image url</label>
            <label htmlFor="providedImg"><input type="radio" name="imageType" value="provided" id="providedImg" onChange={handleImgTypeChange} checked={imageType === "provided"} /> Select an icon</label>
        </div>
        {imageType === "custom" ? <div className="w-full flex flex-col">
            <label htmlFor="image" className="text-xs text-theme-text-muted/80 text-left italic">Character Image</label>
            <input type="text" defaultValue={watch("image.type") === "custom" ? watch("image.url") : ""} onBlur={(e) => handleCustomImg(e)} className="w-full" />
            <p className="text-xs text-theme-text-muted/80 text-left">paste image url. png, jpeg, webp accepted. displays in square aspect ratio.</p>
        </div> : <div className="grid grid-cols-5 gap-2 justify-center items-center mx-auto">
                {unusedIcons.map((icon) => <Thumbnail key={`icon-${icon}`} imageKey={icon} currentImg={watch("image")} handleImgClick={handleImageClick} />)}</div>}
       
            <Divider />
            <p className="text-sm text-center w-full">Abilities</p>
            <div className="flex gap-2 justify-center">
                <div className="flex flex-col">
                    <label htmlFor="abilities.vitality" className="text-xs text-theme-text-muted/80 text-center">Vitality</label>
                    <input type="number" {...register("abilities.vitality")} className="w-1/2 mx-auto text-center" />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="abilities.composure" className="text-xs text-theme-text-muted/80 text-center">Composure</label>
                    <input type="number" {...register("abilities.composure")} className="w-1/2 mx-auto text-center" />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="abilities.reason" className="text-xs text-theme-text-muted/80 text-center">Reason</label>
                    <input type="number" {...register("abilities.reason")} className="w-1/2 mx-auto text-center" />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="abilities.presence" className="text-xs text-theme-text-muted/80 text-center">Presence</label>
                    <input type="number" {...register("abilities.presence")} className="w-1/2 mx-auto text-center" />
            </div>
            <div className="flex flex-col">
                    <label htmlFor="abilities.sensitivity" className="text-xs text-theme-text-muted/80 text-center">Sensitivity</label>
                    <input type="number" {...register("abilities.sensitivity")} className="w-1/2 mx-auto text-center" />
                </div>
        </div>
        <MovesSection myMoves={character.moves}/>
            <button type="submit" className="formButton mx-auto my-6">Save Changes</button>
        </div>
</form>

}

function Thumbnail({ imageKey, currentImg, handleImgClick }: { imageKey: string, currentImg: Img, handleImgClick: (arg0: string) => void }) {
    const isCurrent = currentImg.type === "default" && currentImg.icon === imageKey;
    const offsetDeg = isCurrent ? 1 : 0
    const gradient = `linear-gradient(to right, hsl(${(offsetDeg * 50)}deg, 100%, 50%), hsl(${(offsetDeg* 50 + 100)}deg, 100%, 50%))`
        const color = `hsl(${offsetDeg * 50 + 180}deg, 100%, 50%)`
    let icon;

    switch (imageKey) {
        case "pizza":
            icon = <Pizza height={64} />
            break;
        case "casette":
            icon = <Casette height={64} />
            break;
        case "arcade":
            icon = <Arcade height={64} />
            break;
        case "cactus":
            icon = <Cactus height={64} />
            break;
        case "invader":
            icon = <Invader height={64} />
            break;
        case "d20":
            icon = <D20 height={64} />
            break;
        case "lizard":
        default:
            icon = <Lizard height={64} />
            break;
    }

    return <button type="button" onClick={() => handleImgClick(imageKey)} className={`max-h-24 flex items-center justify-center border-2 rounded-sm p-1 aspect-square hover:brightness-110 hover:saturate-100 transition-brightness duration-300`
} style = {{ background: gradient, color }}>
    { icon }
    </button>
}

function MovesSection({ myMoves }: { myMoves: Moves[]}) {
    const { gameState, updateGameState, user } = useGame();
    const movesInPlay = gameState.players.flatMap((player) => player.character?.moves || []).map((move) => move.name);
    const [selectedMove, setSelectedMove] = useState<string>("");
    const [isAdding, setIsAdding] = useState(false);

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
                moves: newMoves, abilities: newAbilities, cornerOfTheHouse: newCornerOfTheHouse
            }
            updateGameState({
                ...gameState,
                players: gameState.players.map((player) => player.id === user.id ? { ...player, character: newCharacter } : player),
            });
            setIsAdding(false);
    }

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

    return <div className="flex flex-col gap-2 w-full">
        <h4 className="text-center text-theme-text-accent">Current Latchkey Moves</h4>
        <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-4 align-start">
            {myMoves.map(({ name, description }) => (
        <div key={`move-${name}`} className={`border border-theme-border box-border rounded-md p-2 h-fit bg-theme-bg-primary max-h-64 overflow-y-auto`}>
            <h4 className={`text-theme-text-accent`}>{name}</h4>
                    <p className="text-xs text-theme-text-secondary text-left">{parseMarkupFromString(description)}</p>
                    <button type="button" onClick={()=> removeMove(name)} className="formButton my-2 text-sm">Remove</button>
        </div>
    )
)}
        </div>
        {!isAdding && <button type="button" className="formButton mx-auto my-6" onClick={() => setIsAdding(true)}>Add Move</button>}
        
        {isAdding && <><h4 className="text-center text-theme-text-accent">Add A Move</h4>
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
            <button type="button" onClick={addMove} className="formButton mx-auto my-6">Confirm Add</button></>}
    </div>
}