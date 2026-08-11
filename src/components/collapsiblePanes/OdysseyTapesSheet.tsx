import { Dialog } from "radix-ui";
import { useForm } from "react-hook-form";
import { CloseButton } from "../shared/CloseButton";
import { useGame } from "../../context/GameContext";
import toast from "react-hot-toast";
import { Divider } from "../shared/Divider";
import { useState } from "react";
import { PlayerRole, type OdysseyTape } from "../../context/types";
import { usePreferences } from "../../context/PreferencesContext";
import { AnimatePresence, motion } from "framer-motion";
import { VHS } from "../svgs/VHS";
import { Pencil } from "../svgs/Pencil";

export function OdysseyTapesSheet() {
	const { gameState: { odysseyTapes } } = useGame()
	
	return (
			<div className="flex flex-col w-full">
			{odysseyTapes.length === 0 && <p className="py-4">No Odyssey Tapes found yet.</p>}
			<div className="flex flex-col gap-2">

				{odysseyTapes.map((tape) => <OdysseyTape tape={tape} />)}
				</div>
			<Divider/>
			<AddOdysseyTapeForm/>
				</div>
	);
}

function OdysseyTape({ tape }: { tape: OdysseyTape }) {
	const [expanded, setExpanded] = useState(false);
	const { gameState, updateGameState, user: { role } } = useGame()
	const { prefersReducedMotion } = usePreferences();
	
	const removeTape = () => {
		updateGameState({
			...gameState, 
			odysseyTapes: gameState.odysseyTapes.filter((t) => t.title !== tape.title)
		})
	}

	const markWatched = () => {
		updateGameState({
			...gameState, 
			odysseyTapes: gameState.odysseyTapes.map((t) => t.title === tape.title ? {...t, watched: !t.watched} : t)
		})
		
	}

	return <div className={`min-h-0 flex flex-col border border-theme-border-accent w-full text-left p-2 relative ${expanded ? "scale-y-100" : "scale-y-auto overflow-visible"}`}>
		<div className="flex w-full">
		<button type="button" onClick={(() => setExpanded(!expanded))} className="flex-1 text-left inline-flex gap-2 group">
			{tape.watched ? <div className="text-theme-text-muted -rotate-30 opacity-50"><VHS /></div> :<div className={`-rotate-20  transition-all text-theme-text-accent group-hover:text-theme-accent-primary ${prefersReducedMotion ? "duration-0" : "duration-750 group-hover:-rotate-50 group-hover:scale-125"}`}><VHS /></div>}
			<h4 className={tape.watched ? "text-theme-text-muted italic line-through" : "text-theme-text-accent"}>{tape.title}</h4>
			</button>
			{role === PlayerRole.KEEPER && <AddOdysseyTapeForm title={tape.title} />}
			</div>
		<AnimatePresence
			mode="popLayout"
		>
			{expanded && <motion.div
				initial={{ height: 0 }}
				animate={{height: "auto"}}
				exit={{ height: 0 }}
				layout

				className={`shrink flex flex-col items-center justify-center gap-2 transform-all ${expanded ? "scale-y-100" : "scale-y-0"} ${prefersReducedMotion ? "duration-0" : "duration-500"} overflow-clip origin-top`}><p className="italic text-sm text-left">{tape.intro}</p>
				<ul className="list-inside list-[upper-roman] text-left text-sm flex flex-col gap-2">
					{tape.prompts.map((prompt) => <li>
						{prompt}
					</li>)}
				</ul>
				<div className="flex gap-2"><button type="button" className="formButton" onClick={markWatched}>{tape.watched ? "Mark Unwatched" : "Mark Watched"}</button>
					{role === PlayerRole.KEEPER && <button type="button" className="formButton" onClick={removeTape}>Remove Tape</button>}</div>
			</motion.div>}
		</AnimatePresence>
	</div>
	
}

type OdysseyTapeInputs = {
	title: string;
	intro:string;
	prompts: string[];
}

function AddOdysseyTapeForm({title}:{title?:string}) {
	const [open, setOpen] = useState(false)
	const { gameState, updateGameState, user: { role } } = useGame();
	const existingTape = gameState.odysseyTapes.find((tape)=> tape.title === title)
	const {register, handleSubmit, reset, setValue, watch} = useForm<OdysseyTapeInputs>({defaultValues: {
		title: existingTape?.title ?? "",
		intro: existingTape?.intro?.join("/n/n") ?? "",
		prompts: existingTape?.prompts ?? ["","","",""],
	}})


	if (role !== PlayerRole.KEEPER) return;

	const saveTape = (data: OdysseyTapeInputs) => {
		let otherTapes =gameState.odysseyTapes
		if (existingTape) {
			otherTapes = otherTapes.filter((tape)=> tape.title !== existingTape.title)
		}
		const newTape = {
			watched: false,
			title: data.title,
			intro: data.intro.split('/n').filter((line) => line !== ""),
			prompts: data.prompts
		}
		updateGameState({
			...gameState,
			odysseyTapes: [...otherTapes, newTape]
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
				{title ? <div className="flex w-8 justify-end items-center cursor-pointer"><Pencil height={18} /></div> : <button className="formButton">Add Odyssey Tape</button>}
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
						<label htmlFor={`prompt-${i}`} key={`prompt-${i}`} className="w-full flex gap-4 flex-col md:flex-row"> Prompt {i+1}: 
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