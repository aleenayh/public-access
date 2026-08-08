import {Dialog} from "radix-ui";
import { useGame } from "../../context/GameContext";
import { useEffect, useState } from "react";
import { PlayerRole } from "../../context/types";
import {useForm, type UseFormRegister, type UseFormSetValue } from "react-hook-form";
import { lookOptions, moves, nameOptions, surnameOptions, takesYouBackOptions, adjustForMove } from "./characterContent";
import { CloseButton } from "../shared/CloseButton";
import { Divider } from "../shared/Divider";
import { parseMarkupFromString } from "../../utils/parseMarkupFromString";
import { getUnusedFallback } from "./utils";
import { StyledButton } from "../shared/StyledButton";
import { VisualThumbnailOnly } from "./components/EditModal";

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
    moves: { name: string, description: string };
    takesYouBack: string;
}

export function CharacterCreateModal({showTrigger=false}:{showTrigger:boolean}) {
    const {gameState, updateGameState, user, claimKeeperRole} = useGame();
    const {register, handleSubmit, setValue, getValues} = useForm({defaultValues: {
        name: "",
        pronouns: "",
        look: "",
        image: "",
        moves: { name: "", description: "" },
        abilities: {
            vitality: 0,
            composure: 1,
            reason: 1,
            presence: 0,
            sensitivity: -1,
        },
        takesYouBack: "",
    }
    });
    
    const hasCreatedCharacter = gameState.players.find((player) => player.id === user.id)?.character !== null;
    const existsSomeKeeper = gameState.players.some((player) => player.role === PlayerRole.KEEPER);
    const [isOpen, setIsOpen] = useState(!hasCreatedCharacter && user.role === PlayerRole.PLAYER) ;
    const [step, setStep] = useState<"initial" | "create" | "moves" | "confirm">("initial");

    const character = gameState.players.find((p)=>p.id === user.id)?.character
    useEffect(() => {
        if (user.role === PlayerRole.KEEPER) return;
        if (character) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStep("initial")
        setIsOpen(true)
    }, [user.role, character])

    const claimKeeper = () => {
        claimKeeperRole(user.id)
        setIsOpen(false);
    };

    const startCharacterCreationFlow = () => {
        setStep("create");
    };

    const createCharacter = () => {
        setStep("moves");
    };

    const addMove = (selectedMove: string) => {
        const description = moves[selectedMove].map((d) => d.trim()).join("\n");
        setValue("moves", { name: selectedMove, description });
        const data = adjustForMove(selectedMove);
        if (data && data.abilities) {
            const currentValues = getValues("abilities");
            const newValues = {
                vitality: currentValues.vitality + data.abilities.vitality,
                composure: currentValues.composure + data.abilities.composure,
                reason: currentValues.reason + data.abilities.reason,
                presence: currentValues.presence + data.abilities.presence,
                sensitivity: currentValues.sensitivity + data.abilities.sensitivity,
            }
            setValue("abilities", newValues);
        }
        setStep("confirm");
    };


    const confirmCharacter = (data: CharacterCreateInputs) => {
        const { name, pronouns, look, image: imageURL, abilities, takesYouBack, moves } = data;
        //abilities already added into preview, only need to add corner of the house here
        const moveAdjustments = adjustForMove(moves.name);
        const character= {
            name,
            pronouns,
            look,
            image: imageURL ? {type: "custom" as const, url: imageURL} : getUnusedFallback(gameState),
            abilities,
            takesYouBack,
            moves: [moves],
            questions: [false, false, false, false, false],
            keysOfTheChild: [false, false, false, false, false],
            keysOfDesolation: [false, false, false, false, false],
            xp: [false, false, false, false, false, false],
            conditions: ["", "", ""],
            cornerOfTheHouse: [...(moveAdjustments?.cornerOfTheHouse || []), { marked: false, item: "" }, { marked: false, item: "" }],
            advancements: {"ability1":false, "ability2":false, "move1":false, "move2":false, "customMove":false, "unmarkItems":false}
        }
        updateGameState({
            ...gameState,
            players: gameState.players.map((player) => player.id === user.id ? { ...player, character } : player),
        });
        setIsOpen(false);
    };


	return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger asChild>
                {showTrigger && <StyledButton onClick={() => setIsOpen(true)}>Create a Latchkey Now</StyledButton>}
            </Dialog.Trigger>
                    <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay" />
			<Dialog.Content className="DialogContent">
                <Dialog.Close asChild>
                    <CloseButton/>
                </Dialog.Close>
				<Dialog.Title className="DialogTitle">Create Latchkey</Dialog.Title>
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
					<button type="button" className="formButton" onClick={claimKeeper}>
						Play as Keeper
					</button>
				<p className="text-xs text-theme-text-muted">
					Think this is a mistake? If you joined the game previously, make sure
					you joined with the same player name as before. Your current player name is {user.name}.
				</p>
			</div>
                    )}
                    {step !== "initial" && <form onSubmit={handleSubmit(confirmCharacter)}>
                        {step === "create" && (
                            <div className="flex flex-wrap text-center w-full">
                                <BlendedInputWithWordCloud optionSets={[nameOptions, surnameOptions]} setValue={setValue} register={register} title="Name" fieldName="name" />
                                <Divider />
                                <InputWithWordCloud options={lookOptions} setValue={setValue} register={register} title="Look" pickNum={1} fieldName="look" />
                                <Divider />
                                <InputWithWordCloud options={takesYouBackOptions} setValue={setValue} register={register} title="What Takes You Back?" pickNum={3} fieldName="takesYouBack" />
                                <Divider />
                                <div className="w-full flex flex-col">
                                    <label htmlFor="image" className="text-xs text-theme-text-muted/80 text-left italic">Character Image (optional)</label>
                                    <input type="text" {...register("image")} className="w-full" />
                                    <p className="text-xs text-theme-text-muted/80 text-left">paste image url. png, jpeg, webp accepted. displays in square aspect ratio.</p>
                                </div>
                                <Divider />
                                <p className="text-sm text-center w-full">Add +1 to any Ability </p>
                                <div className="flex gap-2 justify-center">
                                    <div className="flex flex-col">
                                        <label htmlFor="abilities.vitality" className="text-xs text-theme-text-muted/80 text-center">Vitality</label>
                                        <input type="number" {...register("abilities.vitality")} className="w-full md:w-1/2 mx-auto text-center" min={-3} />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="abilities.composure" className="text-xs text-theme-text-muted/80 text-center">Composure</label>
                                        <input type="number" {...register("abilities.composure")} className="w-full md:w-1/2 mx-auto text-center" min={-3} />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="abilities.reason" className="text-xs text-theme-text-muted/80 text-center">Reason</label>
                                        <input type="number" {...register("abilities.reason")} className="w-full md:w-1/2 mx-auto text-center" min={-3}/>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="abilities.sensitivity" className="text-xs text-theme-text-muted/80 text-center">Sensitivity</label>
                                        <input type="number" {...register("abilities.sensitivity")} className="w-full md:w-1/2 mx-auto text-center" min={-3} />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="abilities.presence" className="text-xs text-theme-text-muted/80 text-center">Presence</label>
                                        <input type="number" {...register("abilities.presence")} className="w-full md:w-1/2 mx-auto text-center" min={-3}/>
                                    </div>
                                </div>
                                <button type="button" onClick={createCharacter} className="formButton mx-auto my-6">Choose Latchkey Move</button>
                            </div>
                        )}
                        {step === "moves" && (
                            <MovePicker onContinue={addMove} onBack={()=> setStep("create")} />
                        )}
                        {step === "confirm" && (
                            <>
                                <div className="flex flex-col gap-2 w-full">
                                    <p className="text-sm text-theme-text-muted">Please review your character and confirm your choices.</p>
                                    <ReviewCharacter data={getValues()}/>
                                </div>
                                <div className="flex w-full justify-evenly">
                                <button type="button" className="formButton mx-auto my-6" onClick={()=>setStep("moves")}>Back</button>
                                    <button type="submit" className="formButton mx-auto my-6">Confirm</button></div>
                            </>
                        )}
                    </form>}
			</Dialog.Content>
            </Dialog.Portal>
		</Dialog.Root>
	);
}

function ReviewCharacter({ data }: { data: CharacterCreateInputs }) {
    const { name, pronouns, look, image, abilities, moves, takesYouBack } = data;
    const { gameState } = useGame();

    return <div className="flex flex-col gap-2 items-center justify-start">
        <div className="flex gap-2 w-full justify-start">
            {image ? <img src={image} className="max-h-32 aspect-square object-contain flex-1 mx-auto" /> : <div className="flex-1 flex justify-center"><VisualThumbnailOnly imageKey={getUnusedFallback(gameState).icon} /></div>}
            <div className="flex-1 flex flex-col justify-center">
            <p className="bold text-lg">{name}</p>
            <p className="italic text-xs">{pronouns}</p>
            </div>
        </div>
        <div className="flex gap-2">
        <p className="flex-1"><span className="[font-variant:small-caps] text-theme-text-muted pr-2">Look:</span>{look}</p>
        <p className="flex-1"><span className="[font-variant:small-caps] text-theme-text-muted pr-2">Takes You Back:</span>{takesYouBack}</p>
        </div>
        <p><span className="[font-variant:small-caps] text-theme-text-muted flex w-full">Moves:</span>
            <span className="bold text-theme-text-accent pr-2">{moves.name}:</span>
            <span className="text-sm leading-none">{moves.description}</span></p>
            <div className="flex gap-2 justify-center">
                                    <div className="flex flex-col">
                                        <label htmlFor="abilities.vitality" className="text-xs text-theme-text-muted/80 text-center">Vitality</label>
                                        <input type="number" disabled value={abilities.vitality} className="w-full md:w-1/2 mx-auto text-center" />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="abilities.composure" className="text-xs text-theme-text-muted/80 text-center">Composure</label>
                                        <input type="number" disabled value={abilities.composure} className="w-full md:w-1/2 mx-auto text-center" />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="abilities.reason" className="text-xs text-theme-text-muted/80 text-center">Reason</label>
                                        <input type="number" disabled value={abilities.reason} className="w-full md:w-1/2 mx-auto text-center" />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="abilities.sensitivity" className="text-xs text-theme-text-muted/80 text-center">Presence</label>
                                        <input type="number" disabled value={abilities.presence} className="w-full md:w-1/2 mx-auto text-center" />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="abilities.presence" className="text-xs text-theme-text-muted/80 text-center">Presence</label>
                                        <input type="number" disabled value={abilities.sensitivity} className="w-full md:w-1/2 mx-auto text-center" />
                                    </div>
                                </div>
    </div>
}

function BlendedInputWithWordCloud({ optionSets, setValue, register, title, fieldName }: { optionSets: string[][], setValue: UseFormSetValue<CharacterCreateInputs>, register: UseFormRegister<CharacterCreateInputs>, title: string, fieldName: keyof CharacterCreateInputs }) {
    //Hardwired for name and pronouns currently; if we want to make this more reusable, some outstanding TODOs
    const [selectedFirstName, setSelectedFirstName] = useState<string>("");
    const [selectedLastName, setSelectedLastName] = useState<string>("");

    const handleClickCloud = (setIndex: number, opt: string) => {
        const newValues = [selectedFirstName, selectedLastName];
        if (setIndex === 0) {
            setSelectedFirstName(opt);
            newValues[0] = opt;
        } else {
            setSelectedLastName(opt);
            newValues[1] = opt;
        }
        setValue(fieldName, newValues.join(" "));
    }

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-2 w-full flex-col md:flex-row">
        <div className="flex-3 flex flex-col mr-2 w-full">
        <label htmlFor={fieldName} className="text-xs text-theme-text-muted/80 text-left italic">{title}</label>
        <input type="text" {...register(fieldName)} className="w-full"/>
        </div>
        <div className="flex-1 flex flex-col">
            <label htmlFor="pronouns" className="text-xs text-theme-text-muted/80 text-left italic">Pronouns</label>
            <input type="text" placeholder="" {...register("pronouns")} />
        </div>
    </div>
            <div className="w-full">
                <p className="text-xs text-theme-text-muted/80 text-left"><strong>Pick one of each, or make up your own:</strong></p>
                <div className="flex gap-2 flex-col md:flex-row">
            {optionSets.map((options, setIndex) => {
                const selectedOpt = setIndex === 0 ? selectedFirstName : selectedLastName;
                const label = setIndex === 0 ? "FIRST NAME" : "LAST NAME";
                return (<div key={`optionSet-${setIndex}`} className="flex flex-wrap gap-1 text-xs relative pl-4 border-b-2 border-theme-border md:border-0">
                    <h3 className="absolute -left-17 top-1/2 tracking-widest text-xs md:text-lg leading-0 text-right -rotate-90 text-theme-text-accent">{label}</h3>
                    {options.map((opt) => <button type="button" key={opt} className={`wordCloudButton ${selectedOpt === opt ? "border border-theme-border" : ""}`} onClick={() => handleClickCloud(setIndex, opt)}>{opt}</button>)}</div>);
            })}
                    </div>
            </div>
        </div>
    )

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

function MovePicker({onContinue, onBack}: {onContinue: (selectedMove:string) => void, onBack:()=>void}) {
    const { gameState } = useGame();
    const movesInPlay = gameState.players.flatMap((player) => player.character?.moves || []).map((move) => move.name);
    const [selectedMove, setSelectedMove] = useState<string>("");

    return (
        <div className="flex flex-col gap-2 w-full">
            <h4 className="text-center text-theme-text-accent">Choose One Latchkey Move</h4>
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
            <div className="flex w-full justify-evenly">
                                <button type="button" className="formButton mx-auto my-6" onClick={onBack}>Back</button>
                <button type="button" onClick={() => onContinue(selectedMove)} className="formButton mx-auto my-6">Reivew & Confirm</button>
            </div>
            </div>
    )
}

