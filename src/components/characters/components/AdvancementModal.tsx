import { Dialog } from "radix-ui";
import { useGame } from "../../../context/GameContext";
import { CloseButton } from "../../shared/CloseButton";
import { useState } from "react";
import { NewMoveOnAdvance } from "./MoveSelector";
import { useForm } from "react-hook-form";
import type { Moves, Abilities, Advancements } from "../types";

export function AdvancementModal() {
    const [isOpen, setIsOpen] = useState(false);

    return <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger className="DialogTrigger">
            Advance
        </Dialog.Trigger>
        <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay" />
			<Dialog.Content className="DialogContent">
                <Dialog.Close asChild>
                    <CloseButton/>
                </Dialog.Close>
				<Dialog.Title className="DialogTitle">Choose an Advancement</Dialog.Title>
				<Dialog.Description className="sr-only">
                    Choose an advancement
                    </Dialog.Description>
                    <AdvanceForm close={()=> setIsOpen(false)}/>
			</Dialog.Content>
            </Dialog.Portal>
    </Dialog.Root>
}

const advancementLabels:Record<keyof Advancements, string> = {
    "ability1": "Increase an ability by 1 (max 3).",
    "ability2": "Increase an ability by 1 (max 3).",
    "move1": "Choose an additional Latchkey move.",
    "move2": "Choose an additional Latchkey move.",
    "customMove": "Write a custom Latchkey move for your character.",
    "unmarkItems": "Unmark all the items in Your Corner of the House. "
}

type AdvancementSteps = keyof Advancements | "pick"

function AdvanceForm({ close }: { close: () => void }) {
    const [step, setStep] = useState<AdvancementSteps>("pick")
    const { gameState, user: { id } } = useGame();
    const character = gameState.players.find((player) => player.id === id)?.character
    if (!character) return;

    const advancementArray = Object.entries(character.advancements).map(([keyString, alreadyTaken]) => {
        const key = keyString as keyof typeof advancementLabels
        const label = advancementLabels[key]
        return {key, label, alreadyTaken}
    })

    return <div>
        {step !== "pick" && <button className="formButton" onClick={()=> setStep("pick")}>Back</button>}
        {step === "pick" && 
            <div className="flex flex-col gap-2">
            {advancementArray.map(({ key, label, alreadyTaken }) => 
                <button key={`advButon-${key}`} type="button" disabled={alreadyTaken===true} onClick={() => setStep(key)} className={`formButton ${alreadyTaken===true ? "strikethrough" : ""}`}>{label}</button>
                )}
            </div>
        }
        {(step === "ability1" || step ==="ability2") && <AbilityAdjust onConfirm={close} />}
        {(step === "move1" || step==="move2") && <NewMoveOnAdvance onConfirm={close} />}
        {step === "customMove" && <WriteCustomMove onConfirm={close}/>}
        {step === "unmarkItems" && <UnmarkItems onConfirm={close}/>}
    </div>
}

function WriteCustomMove({ onConfirm }: { onConfirm: () => void }) {
    const { gameState, updateGameState, user: { id } } = useGame();
    const { register, handleSubmit } = useForm<Moves>({defaultValues: {name: "", description: ""}});
    const character = gameState.players.find((player) => player.id === id)?.character
    if (!character) return;
    const advancements = { ...character.advancements, customMove:true };
    
    const confirm = (data: Moves) => {
        const characterMoves = [...character.moves, data]
        updateGameState({
            ...gameState, 
            players: gameState.players.map((p) => p.id === id && p.character ? {
                ...p, 
                character: {
                    ...p.character,
                    moves: characterMoves,
                    advancements,
                }
            } : p)
        })
        onConfirm();
    }

    return <form onSubmit={handleSubmit(confirm)} className="flex flex-col justify-center items-center gap-4 ">
        <h4>Write a Custom Latchkey Move</h4>
        <div className="w-full flex flex-col">
            <label htmlFor="name" className="text-xs text-theme-text-muted/80 text-left italic">Name of Move</label>
            <input type="text" {...register("name")} className="w-full" />
        </div>
        <div className="w-full flex flex-col">
            <label htmlFor="description" className="text-xs text-theme-text-muted/80 text-left italic">Move Text</label>
            <textarea {...register("description")} className="w-full" />
        </div>
        <button type="submit" className="formButton">Confirm</button>
    </form>
}

function AbilityAdjust({ onConfirm }: { onConfirm: () => void }) {
    const { gameState, updateGameState, user: { id } } = useGame();
    const character = gameState.players.find((player) => player.id === id)?.character;
    const {register, handleSubmit} = useForm<Abilities>({defaultValues: {
            vitality: character?.abilities.vitality ?? 0,
            composure: character?.abilities.composure ?? 1,
            reason: character?.abilities.reason ?? 1,
            presence: character?.abilities.presence ?? 0,
            sensitivity: character?.abilities.sensitivity ?? -1,
    }
    });
    if (!character) return;

    const advancements = {
        ...character.advancements,
        ...(character.advancements.ability1===true ? {ability2:true} : {ability1:true})
     };


    const handleConfirm = (data:Abilities) => {
        const abilities = {
            vitality: Number(data.vitality),
            composure: Number(data.composure),
            reason: Number(data.reason),
            sensitivity: Number(data.sensitivity),
            presence: Number(data.presence),
        }
        updateGameState({
            ...gameState, 
            players: gameState.players.map((p) => p.id === id && p.character ? {
                ...p, 
                character: {
                    ...p.character,
                    abilities,
                    advancements,
                }
            } : p)
        })
        onConfirm();
    }

    return <form onSubmit={handleSubmit(handleConfirm)} className="flex flex-col items-center gap-4">
                    <h4>Add One to Any Ability</h4>
        <div className="flex gap-2 justify-center">
        <div className="flex flex-col">
            <label htmlFor="abilities.vitality" className="text-xs text-theme-text-muted/80 text-center">Vitality</label>
            <input type="number" {...register("vitality")} className="w-1/2 mx-auto text-center" min={character.abilities.vitality}/>
        </div>
        <div className="flex flex-col">
            <label htmlFor="abilities.composure" className="text-xs text-theme-text-muted/80 text-center">Composure</label>
            <input type="number" {...register("composure")} className="w-1/2 mx-auto text-center" min={character.abilities.composure}/>
        </div>
        <div className="flex flex-col">
            <label htmlFor="abilities.reason" className="text-xs text-theme-text-muted/80 text-center">Reason</label>
            <input type="number" {...register("reason")} className="w-1/2 mx-auto text-center" min={character.abilities.reason}/>
        </div>
        <div className="flex flex-col">
            <label htmlFor="abilities.presence" className="text-xs text-theme-text-muted/80 text-center">Presence</label>
            <input type="number" {...register("presence")} className="w-1/2 mx-auto text-center" min={character.abilities.presence} />
        </div>
        <div className="flex flex-col">
            <label htmlFor="abilities.sensitivity" className="text-xs text-theme-text-muted/80 text-center">Sensitivity</label>
            <input type="number" {...register("sensitivity")} className="w-1/2 mx-auto text-center" min={character.abilities.sensitivity}/>
        </div>
        </div>

        <button type="submit" className="formButton">Confirm</button>
    </form>
}

function UnmarkItems({ onConfirm }: { onConfirm: () => void }) {
    const { gameState, updateGameState, user: { id } } = useGame()
    const character = gameState.players.find((player) => player.id === id)?.character
    if (!character) return

    const advancements = { ...character.advancements, unmarkItems:true };
    const numberMarked = character.cornerOfTheHouse.reduce(
        (accumulator, item) => accumulator + (item.marked ? 1 : 0),
        0,
      );

    const handleConfirm = () => {
        const cornerOfTheHouse = character.cornerOfTheHouse.map((item) => { return { ...item, marked: false } })
        updateGameState({
            ...gameState, 
            players: gameState.players.map((p) => p.id === id && p.character ? {
                ...p, 
                character: {
                    ...p.character,
                    cornerOfTheHouse,
                    advancements,
                }
            } : p)
        })
        onConfirm();
    }

    return <div className="flex flex-col justify-center items-center gap-4 my-8">
        Unmark all items from your Corner of the House.

        This will unmark {numberMarked} items.

        <button type="button" className="formButton" onClick={handleConfirm}>Confirm</button>
    </div>

}

