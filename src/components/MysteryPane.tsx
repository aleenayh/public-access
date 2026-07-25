import { Dialog } from "radix-ui";
import { useGame } from "../context/GameContext";
import { PlayerRole, type Mystery } from "../context/types";
import { parseMarkupFromString } from "../utils/parseMarkupFromString";
import { CloseButton } from "./shared/CloseButton";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Divider } from "./shared/Divider";
import { useEffect, useState } from "react";
import { Pencil } from "./svgs/Pencil";

export function MysteryPane() {
	const { gameState, user:{role} } = useGame();
	const regularMysteries = gameState.mysteries.filter((mystery) => mystery.id !== "tv-odyssey-mystery");
	const [displayedMystery, setDisplayedMystery] = useState<string | null>(regularMysteries[0]?.id || null);

	//reset the displayed mystery if a mystery is added or removed; otherwise can get stuck on a removed mystery
	useEffect(() => {
		const filteredMysteries =gameState.mysteries.filter((mystery) => mystery.id !== "tv-odyssey-mystery");
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setDisplayedMystery(filteredMysteries[0]?.id || null)
	}, [gameState.mysteries, setDisplayedMystery])
	
	return (
		<div className="flex flex-col w-full h-full justify-start">
			{regularMysteries.length > 1 && <div className="flex gap-2 justify-center">{regularMysteries.map((mystery) => <button key={mystery.id} onClick={() => setDisplayedMystery(mystery.id)} className="formButton max-w-1/3 grow text-xs leading-none text-balance">{mystery.name}</button>)}</div>}
			{displayedMystery && <MysteryContent mysteryId={displayedMystery} key={displayedMystery} />}
			{role === PlayerRole.KEEPER && <AddMysteryButton />}
			</div>
	);
}

export function MysteryContent({ mysteryId }: { mysteryId: string }) {
	const { gameState, updateGameState, user: {role} } = useGame();
	const {register, handleSubmit, reset} = useForm<{clue:string}>({
		defaultValues: {
			clue: "",
		},
	});
	const mystery = gameState.mysteries.find((m) => m.id === mysteryId);
	if (!mystery) return;

	const addClue = (data: {clue:string}) => {
		const newClues = [...mystery.clues, {text: data.clue, used: false}];
		updateGameState({
			...gameState,
			mysteries: gameState.mysteries.map((m) => m.id === mystery.id ? { ...m, clues: newClues } : m),
		});
		toast.success(`Clue added: ${data.clue}`)
		reset();
	}
	const turnKey = () => {
		updateGameState({
			...gameState,
			mysteries: gameState.mysteries.map((m) => m.id === mysteryId ? { ...m, customKey: { title: m.customKey?.title || "", text: m.customKey?.text || "", checked: !m.customKey?.checked } } : m),
		})
	}
	const markClue = (text: string) => {
		updateGameState({
			...gameState,
			mysteries: gameState.mysteries.map((m) => m.id === mysteryId ? { ...m, clues: m.clues.map((c) => c.text === text ? { ...c, used: !c.used } : c) } : m),
		})
	}
	
	return ( 
		<div className={`w-full h-full flex flex-col gap-2`}>
			<h3 className="text-lg font-bold text-theme-text-accent flex gap-2 items-center"><span className="grow">{mystery.name}</span> {role === PlayerRole.KEEPER && <EditMysteryButton mystery={mystery} />}</h3> 
			
			{mystery.intro && <div className="border border-theme-border">{mystery.intro.map((line) => <p key={line}>{parseMarkupFromString(line)}</p>)}</div>}

			<div className="flex flex-col gap-2 grow">
			<div className="flex gap-2"><div className="border border-theme-border flex-1 p-2">
				{mystery.questions.map((question) => <div key={question.text}>
					<h4 className="text-sm font-bold text-theme-text-accent">{question.text}</h4><span className="text-xs text-theme-text-muted">Complexity: {question.complexity}</span>
					{question.opportunity && <p className="text-xs text-left">Opportunity: <span className="italic">{question.opportunity}</span></p>}
					</div>)}
				</div>

				<div className="border border-theme-border flex-1"><h4>Clues</h4>
				<div className="text-xs flex justify-center items-center text-theme-text-muted">earned: {mystery.clues.length} <Diamond/> used: {mystery.clues.filter((c) => c.used).length} <Diamond/> available: {mystery.clues.filter((c) => !c.used).length}</div>
					<ul className="list-none">
						{mystery.clues.map((clue) => <li key={clue.text} className={`${clue.used ? "text-theme-text-muted" : ""} text-left`}>
							<input type="checkbox" defaultChecked={clue.used} className="mr-2" onChange={() => markClue(clue.text)} />
							{parseMarkupFromString(clue.text)}</li>)}</ul>
			</div></div>
			
			<form onSubmit={handleSubmit(addClue)} className="flex gap-2 items-center">
				<label htmlFor="clue" className="sr-only">Add a clue</label>
				<input type="text" placeholder="Add clue..." required={true} className="flex-1" {...register("clue")} />
				<button type="submit" className="formButton">+</button>
			</form>
			</div>


			{mystery.customKey && <div className="border border-theme-border p-2">
				<h4 className="text-md font-bold text-theme-text-accent">{mystery.customKey.title}</h4>
				<p className="text-left"><input type="checkbox" defaultChecked={mystery.customKey.checked} className="mr-2" onChange={turnKey} />
				{parseMarkupFromString(mystery.customKey.text)}
				</p>
				</div>
			}
			</div>
	)
}

function Diamond() {
	return <span className="text-theme-text-accent text-[0.5rem] px-2">◈</span>
}

type AddMysteryInputs = {
	name: string;
	introduction: string | undefined;
	questions: { text: string, complexity: number, opportunity: string }[];
	customKey: {title: string, text: string} | undefined;
}

function EditMysteryButton({ mystery }: { mystery: Mystery }) {
	const [open, setOpen] = useState(false);
	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger>
				<Pencil />
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="DialogOverlay" />
				<MysteryForm mystery={mystery} closeModal={() => setOpen(false)} />
			</Dialog.Portal>
		</Dialog.Root>
	)
}

function AddMysteryButton() {
	const [open, setOpen] = useState(false);
	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger asChild>
				<button className="formButton justify-self-end my-4">
					Add Mystery
				</button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="DialogOverlay" />
				<MysteryForm closeModal={() => setOpen(false)} />
			</Dialog.Portal>
		</Dialog.Root>
	)
}

function MysteryForm({ mystery, closeModal }: {mystery?:Mystery, closeModal: () => void}) {
	const { gameState, updateGameState } = useGame();
	const {register, handleSubmit, reset, watch, setValue} = useForm<AddMysteryInputs>({
		defaultValues: {
			name: mystery?.name || "",
			introduction: mystery?.intro?.join("\n") || undefined,
			questions: mystery?.questions || [{text: "", complexity: 6, opportunity: ""}],
			customKey: mystery?.customKey ? {title: mystery.customKey.title, text: mystery.customKey.text} : undefined,
		},
	});

	const addQuestion = () => {
		const newQuestions = [...watch("questions"), {text: "", complexity: 6, opportunity: ""}];
		setValue("questions", newQuestions);
	}
	const removeQuestion = (index: number) => {
		const newQuestions = watch("questions").filter((_, i) => i !== index);
		setValue("questions", newQuestions);
	}
	
	const addMystery = (data: AddMysteryInputs) => {
		const id = mystery?.id || crypto.randomUUID();
		const omitKey = data.customKey?.text === "" && data.customKey.title === ""
		const customKey = omitKey ? undefined : { checked: mystery?.customKey?.checked || false, title: data.customKey?.title || "", text: data.customKey?.text || "" };
		const newMystery: Mystery = {
			id,
			name: data.name,
			intro: data.introduction?.split("\n").filter((line) => line !== "") || undefined,
			questions: data.questions,
			clues: mystery?.clues || [],
			...(!omitKey && {customKey: customKey}),
		}
		if (mystery) {
			updateGameState({
				...gameState,
				mysteries: gameState.mysteries.map((m) => m.id === mystery.id ? newMystery : m)
			})
			toast.success(`Mystery updated: ${data.name}`)
		} else {
			updateGameState({
				...gameState,
				mysteries: [...gameState.mysteries, newMystery],
			})
			toast.success(`Mystery added: ${data.name}`)
		}
		closeModal();
		reset();
	}

	const removeMystery = () => {
		updateGameState({
			...gameState,
			mysteries: gameState.mysteries.filter((m) => m.id !== mystery?.id),
		})
		toast.success(`Mystery removed: ${mystery?.name}`)
		closeModal();
	}
	return (
				<Dialog.Content className="DialogContent">
					<Dialog.Close asChild>
						<CloseButton />
					</Dialog.Close>
					<Dialog.Title className="DialogTitle">{mystery ? "Edit Mystery" : "Add Mystery"}</Dialog.Title>
					<Dialog.Description className="DialogDescription hidden">
						Add a new mystery to the game or edit an existing mystery.
					</Dialog.Description>
					<form onSubmit={handleSubmit(addMystery)} className="flex flex-col gap-2">
						<label htmlFor="name">Mystery Title</label>
						<input type="text" required={true} {...register("name")} />

						<label htmlFor="introduction">Introduction: <span className="text-xs text-theme-text-muted mx-1 italic">(Optional)</span></label>
						<textarea {...register("introduction")} />
						<Divider/>

						{watch("questions")?.map((_, index) => (
							<div key={`question-${index}`} className="grid grid-cols-[4fr_1fr] gap-2">
								<label htmlFor={`questions.${index}.text`} className="flex flex-col"><span>Question: 								<button type="button" onClick={() => removeQuestion(index)} className="px-1 text-xs text-theme-text-muted bg-theme-bg-primary rounded-lg hover:bg-theme-bg-secondary border border-theme-border hover:text-theme-text-accent mx-6 my-1">Remove</button></span>
								<input type="text" {...register(`questions.${index}.text`)} /></label>
								<label htmlFor={`questions.${index}.complexity`}>Complexity:
								<input type="number" min={1} max={16} {...register(`questions.${index}.complexity`)} /></label>
								<label htmlFor={`questions.${index}.opportunity`} className="col-span-2 flex gap-2 items-center">Opportunity:
								<input type="textarea" className="grow" {...register(`questions.${index}.opportunity`)} /></label>
							</div>
						))}
						<button type="button" className="formButton" onClick={addQuestion}>Add Another Question</button>
						<Divider/>
						<label htmlFor="customKey">Custom Key: <span className="text-xs text-theme-text-muted mx-1 italic">(Optional)</span></label>
						
							<input type="text" className="flex-1" placeholder="Title..."{...register("customKey.title")} />
						<input type="textarea" placeholder="Key Prompt..." {...register("customKey.text")} />
						<Divider/>

						<div className="flex gap-2 justify-between"><button type="submit" className="formButton grow">
							{mystery ? "Save Changes" : "Add Mystery"}
				</button>
				{mystery && <button type="button" className="formButton grow" onClick={removeMystery}>Remove Mystery</button>}
				</div>
					</form>
				</Dialog.Content>
	)
}
