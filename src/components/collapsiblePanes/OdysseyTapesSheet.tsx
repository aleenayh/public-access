import { Dialog } from "radix-ui";
import { useForm } from "react-hook-form";
import { CloseButton } from "../shared/CloseButton";
import { useGame } from "../../context/GameContext";
import toast from "react-hot-toast";
import { Divider } from "../shared/Divider";
import { useState } from "react";

export function OdysseyTapesSheet() {
	const {gameState: {odysseyTapes}} = useGame()
	return (
			<div className="flex flex-col w-full">
			<h3 className="text-2xl font-bold text-theme-text-accent">Odyssey Tapes</h3>

			<p>TODO! This is only half built.</p>


			<p className="border border-theme-border">{odysseyTapes.map((tape) => <span>{tape.title}</span>)}</p>
			<Divider/>
			<AddOdysseyTapeForm/>
				</div>
	);
}

type OdysseyTapeInputs = {
	title: string;
	intro:string;
	prompts: string[];
}

function AddOdysseyTapeForm() {
	const [open, setOpen] = useState(false)
	const {register, handleSubmit, reset, setValue, watch} = useForm<OdysseyTapeInputs>({defaultValues: {
		title: "",
		intro: "",
		prompts: ["","","",""],
	}})
	const {gameState, updateGameState} = useGame();

	const saveTape = (data:OdysseyTapeInputs) => {
		const newTape = {
			watched: false,
			title: data.title,
			intro: data.intro.split('/n').filter((line) => line !== ""),
			prompts: data.prompts
		}
		updateGameState({
			...gameState,
			odysseyTapes: [...gameState.odysseyTapes, newTape]
		}
		)
		toast.success('Tape added')
		setOpen(false)
		reset();
	}

	const addPrompt = () => {
		setValue("prompts", [...watch("prompts"), ""])
	}
	const removePrompt = (index:number) => {
		setValue("prompts", watch("prompts").filter((_, i) => i !== index))

	}
	return (
	<Dialog.Root open={open} onOpenChange={setOpen}>
		<Dialog.Trigger asChild>
			<button className="formButton">Add Odyssey Tape</button>
		</Dialog.Trigger>
		<Dialog.Portal>
			<Dialog.Overlay className="DialogOverlay"/>
			<Dialog.Content className="DialogContent">
				<Dialog.Title className="DialogTitle">Add Odyssey Tape</Dialog.Title>
				<Dialog.Close><CloseButton/></Dialog.Close>
				<Dialog.Description className="hidden">Add an Oddysey Tape to the game</Dialog.Description>
				<form onSubmit={handleSubmit(saveTape)} className="flex flex-col gap-2">
					<label htmlFor="title" className="w-full flex gap-4">Title 
						<input type="text" className="grow" {...register("title")}/>
					</label>
					<label htmlFor="intro" className="w-full flex gap-4 items-baseline">Introduction
						<textarea className="grow min-h-8" {...register("intro")}/>
					</label>
					{watch("prompts").map((_, i) => 
						<label htmlFor={`prompt-${i}`} key={`prompt-${i}`} className="w-full flex gap-4"> Prompt {i+1}: 
						<textarea className="grow min-h-8" {...register(`prompts.${i}`)}/>
						<button type="button" onClick={() => removePrompt(i)} className="h-fit px-1 text-xs text-theme-text-muted bg-theme-bg-primary rounded-lg hover:bg-theme-bg-secondary border border-theme-border hover:text-theme-text-accent mx-6 my-1">Remove</button>
						</label>
				)}
				<button type="button" onClick={addPrompt} className="formButton">Add a prompt</button>
				<Divider/>
				<button type="submit" className="formButton">Save Odyssey Tape</button>


				</form>
			</Dialog.Content>
		</Dialog.Portal>






	</Dialog.Root>)
}