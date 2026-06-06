import {Dialog} from "radix-ui";
import { useGame } from "../../context/GameContext";
import { useState } from "react";
import { PlayerRole, type GameState, } from "../../context/types";
import {useForm, type UseFormRegister, type UseFormSetValue } from "react-hook-form";
import { lookOptions, takesYouBackOptions } from "./characterContent";

type CharacterCreateInputs = {
    name: string;
    pronouns: string;
    look: string;
    image: string;
    abilities: {
        vitality: number;
        sensitivity: number;
        composure: number;
        reason: number;
        presence: number;
    };
    takesYouBack: string;
}

export function CharacterCreateModal() {
    const {gameState, updateGameState, user} = useGame();
    const {register, handleSubmit, setValue} = useForm({defaultValues: {
        name: "",
        pronouns: "",
        look: "",
        image: "",
        abilities: {
            vitality: 0,
            composure: 1,
            reason: 1,
            presence: 0,
            sensitivity: -1,
        },
        takesYouBack: "",
    }});

    const hasCreatedCharacter = gameState.players.find((player) => player.id === user.id)?.character !== null;
    const existsSomeKeeper = gameState.players.some((player) => player.role === PlayerRole.KEEPER);
    const [isOpen, setIsOpen] = useState(!hasCreatedCharacter && user.role === PlayerRole.PLAYER) ;
    const [step, setStep] = useState<"initial" | "create" | "moves" | "confirm">("initial");

    const claimKeeper = () => {
        updateGameState({
            ...gameState,
            players: gameState.players.map((player) => player.id === user.id ? { ...player, role: PlayerRole.KEEPER } : player),
        });
        setIsOpen(false);
    };

    const startCharacterCreationFlow = () => {
        setStep("create");
    };

    // const createCharacter = () => {
    //     setStep("moves");
    // };

    // const addMove = () => {
    //     setStep("confirm");
    // };


    const confirmCharacter = (data: CharacterCreateInputs) => {
        const {name, pronouns, look, image: imageURL, abilities, takesYouBack} = data;
        const character= {
            name,
            pronouns,
            look,
            image: imageURL ? {type: "custom" as const, url: imageURL} : getUnusedFallback(gameState),
            abilities,
            takesYouBack,
            moves: [], //TODO
            questions: [false, false, false, false, false],
            keysOfTheChild: [false, false, false, false, false],
            keyOfDesolation: [false, false, false, false, false],
        }
        updateGameState({
            ...gameState,
            players: gameState.players.map((player) => player.id === user.id ? { ...player, character } : player),
        });
        setIsOpen(false);
    };


	return (

		<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
                    <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay" />
			<Dialog.Trigger asChild>
				<button type="button">Create Character</button>
			</Dialog.Trigger>
			<Dialog.Content className="DialogContent">
                <Dialog.Close className="DialogClose">
                    X
                </Dialog.Close>
				<Dialog.Title className="DialogTitle">Create Character</Dialog.Title>
				<Dialog.Description className="sr-only">
                    Create a new Latchkey 
				</Dialog.Description>
                {step === "initial" && (
			<div className="flex flex-col gap-4 text-center max-w-1/2 mx-auto">
				It looks like you don't have a character yet.
				{!existsSomeKeeper && <p>This game also doesn't have a Keeper yet.</p>}
				<button
					type="button"
					className="formButton"
					onClick={startCharacterCreationFlow}
				>
					Create new character
				</button>
				{!existsSomeKeeper && (
					<button type="button" className="formButton" onClick={claimKeeper}>
						Play as Keeper
					</button>
				)}
				<p className="text-xs text-theme-text-muted">
					Think this is a mistake? If you joined the game previously, make sure
					you joined with the same player name as before.
				</p>
			</div>
		)}
        {step !== "initial" && (
            <form onSubmit={handleSubmit(confirmCharacter)} className="flex flex-wrap text-center w-full">
                <div className="flex-3 flex flex-col mr-2">
                <label htmlFor="name" className="text-xs text-theme-text-muted/80 text-left italic">Character Name</label>
                <input type="text" {...register("name")} />
                </div>
                <div className="flex-1 flex flex-col">
                <label htmlFor="pronouns" className="text-xs text-theme-text-muted/80 text-left italic">Pronouns</label>
                <input type="text" placeholder="" {...register("pronouns")} />
                </div>
                <p className="w-full text-xs text-theme-text-muted/80 text-left"><strong>Pick one, or make up your own:</strong> thing, thing, thing</p>
                <Seperator/>
                <InputWithWordCloud options={lookOptions} setValue={setValue} register={register} title="Look" pickNum={1} fieldName="look" />
                <Seperator/>
                <InputWithWordCloud options={takesYouBackOptions} setValue={setValue} register={register} title="What Takes You Back?" pickNum={3} fieldName="takesYouBack" />
                <Seperator/>
                <div className="w-full flex flex-col">
                <label htmlFor="image" className="text-xs text-theme-text-muted/80 text-left italic">Character Image (optional)</label>
                <input type="text" {...register("image")} className="w-full"/>
                <p className="text-xs text-theme-text-muted/80 text-left">paste image url. png, jpeg, webp accepted. displays in square aspect ratio.</p>
                </div>
                <Seperator/>
                <p className="text-sm text-center w-full">Add +1 to any Ability </p>
                <div className="flex gap-2 justify-center">
                    <div className="flex flex-col">
                    <label htmlFor="abilities.vitality" className="text-xs text-theme-text-muted/80 text-center">Vitality</label>
                    <input type="number" {...register("abilities.vitality")} className="w-1/2 mx-auto text-center"/>
                        </div>
                    <div className="flex flex-col">
                    <label htmlFor="abilities.composure" className="text-xs text-theme-text-muted/80 text-center">Composure</label>
                    <input type="number" {...register("abilities.composure")} className="w-1/2 mx-auto text-center"/>
                    </div>
                    <div className="flex flex-col">
                    <label htmlFor="abilities.reason" className="text-xs text-theme-text-muted/80 text-center">Reason</label>
                    <input type="number" {...register("abilities.reason")} className="w-1/2 mx-auto text-center"/>
                    </div>
                    <div className="flex flex-col">
                    <label htmlFor="abilities.sensitivity" className="text-xs text-theme-text-muted/80 text-center">Sensitivity</label>
                    <input type="number" {...register("abilities.sensitivity")} className="w-1/2 mx-auto text-center"/>
                    </div>
                    <div className="flex flex-col">
                    <label htmlFor="abilities.presence" className="text-xs text-theme-text-muted/80 text-center">Presence</label>
                    <input type="number" {...register("abilities.presence")} className="w-1/2 mx-auto text-center"/>
                    </div>
                </div>
                <button type="submit" className="formButton mx-auto my-6">Choose Latchkey Move</button>
            </form>
        )}
			</Dialog.Content>
            </Dialog.Portal>
		</Dialog.Root>

	);
}

function InputWithWordCloud({options, setValue, register, title, pickNum, fieldName}: {options: string[], setValue: UseFormSetValue<CharacterCreateInputs>, register: UseFormRegister<CharacterCreateInputs>, title: string, pickNum: number, fieldName: keyof CharacterCreateInputs}) {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const handleClickCloud = (opt: string) => {
        let newValues = [...selectedOptions];
        if (selectedOptions.includes(opt)) {
            newValues = newValues.filter((o) => o !== opt);
        } else if (selectedOptions.length >= pickNum) {
            newValues = [...selectedOptions.slice(1), opt];
        } else {
            newValues = [...selectedOptions, opt];
        }
        setSelectedOptions(newValues);
        setValue(fieldName,newValues.join(", "));
    }

    return (
        <div className="w-full flex flex-col">
        <label htmlFor={fieldName} className="text-xs text-theme-text-muted/80 text-left italic">{title}</label>
        <input type="text" {...register(fieldName)} className="w-full"/>
        <p className="text-xs text-theme-text-muted/80 text-left"><strong>Pick {pickNum} or make up your own:</strong></p>
        <div className="flex flex-wrap gap-1 text-xs">{options.map((opt) => <button type="button" key={opt} className={`wordCloudButton ${selectedOptions.includes(opt) ? "border border-theme-border" : ""}`} onClick={() => handleClickCloud(opt)}>{opt}</button>)}</div>
        </div>
    )

}

function Seperator() {
    return (
        <div className="w-full h-px bg-theme-border-accent my-2"/>
    );
}

function getUnusedFallback(gameState: GameState) {
    const charactersWithIcons = gameState.players.flatMap((player) =>
        player.character?.image.type === "default" ? [player.character] : []
      );
    const usedIcons = charactersWithIcons.map((character) => character.image.type === "default" ? character.image.icon : undefined).filter((icon) => icon !== undefined);
    const fallbackIcons = ["pizza", "casette", "arcade", "cactus"];
    const unusedIcons = fallbackIcons.filter((icon) => !usedIcons.includes(icon));
    return {type: "default" as const, icon: unusedIcons[0]};
}