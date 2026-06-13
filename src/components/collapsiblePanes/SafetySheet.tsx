import { useGame } from "../../context/GameContext";
import { Divider } from "../shared/Divider";
import { Dialog } from "radix-ui";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { CloseButton } from "../shared/CloseButton";

export function SafetySheet() {
    return (
            <div className="flex flex-col gap-4 justify-start items-center h-full">
              <p className="text-balance text-sm text-left">
                No game is more important than the people playing it. Your game may use any safety tools you wish, but the Gauntlet typically recommends the Open Door Policy, the X-Card, and Lines and Veils. Each are explained below, and this app includes support to share Lines and Veils between players.
              </p>

              <LinesAndVeils />
              <Divider />
              <AddLineOrVeilForm />
              <Divider />
              <ExplainerSections />
            </div>
    )
}


function LinesAndVeils() {
    const { gameState } = useGame()
    const { lines, veils } = gameState.safety || { lines: [], veils: [] }
  
    return (
      <div className="w-full px-8  flex flex-col gap-2 md:grid md:grid-cols-2 md:gap-6 md:justify-between text-left">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-theme-text-accent">Lines</h3>
          <ul className=" text-sm">
            {lines ? lines.map((line) => <li key={line}>{line}</li>) : <li>No lines have been added yet.</li>}
          </ul>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-theme-text-accent">Veils</h3>
          <ul className="text-sm">
            {veils ? veils.map((veil) => <li key={veil}>{veil}</li>) : <li>No veils have been added yet.</li>}
          </ul>
        </div>
        <Dialog.Root>
         <Dialog.Trigger asChild>
            <div className="md:col-span-2 mx-auto w-2/5">
              <button
              type="button"
              className="gridButton"
            >
              Adjust or Remove Lines and Veils
            </button>
            </div>
          </Dialog.Trigger>
  
          <Dialog.Portal>
            <Dialog.Overlay className="DialogOverlay" />
            <Dialog.Content className="DialogContent">
              <Dialog.Close asChild>
                <CloseButton/>
              </Dialog.Close>
              <Dialog.Title className="DialogTitle">Adjust or Remove Lines and Veils</Dialog.Title>
              <Dialog.Description className="DialogDescription hidden">Adjust or remove lines and veils.</Dialog.Description>
              <div className="flex flex-col gap-2 w-full">
                <ul className="text-sm gap-2">
                  <h3 className="text-md font-bold text-theme-text-accent">Lines</h3>
                  <div className="flex flex-col gap-2">
                  {lines ? (
                    lines.map((line, index) => (
                      <li key={line} className="flex items-center gap-2">
                        <EditLineOrVeilForm type="line" index={index} text={line} />{" "}
                      </li>
                    ))
                  ) : (
                    <li>No lines have been added yet.</li>
                  )}
                  </div>
                  <h3 className="pt-2 text-md font-bold text-theme-text-accent">Veils</h3>
                  <div className="flex flex-col gap-2">
                  {veils ? (
                    veils.map((veil, index) => (
                      <li key={veil} className="flex items-center gap-2">
                        <EditLineOrVeilForm type="veil" index={index} text={veil} />{" "}
                      </li>
                    ))
                  ) : (
                    <li>No veils have been added yet.</li>
                  )}
                  </div>
                </ul>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    )
  }
  
  function EditLineOrVeilForm({ type, index, text }: { type: "line" | "veil"; index: number; text: string }) {
    const { gameState, updateGameState } = useGame()
    const { register, handleSubmit, reset } = useForm<{ text: string }>({
      defaultValues: {
        text: text,
      },
    })
    const { lines, veils } = gameState.safety || { lines: [], veils: [] }
  
    const edit = (data: { text: string }) => {
      const newLines = type === "line" ? lines?.map((line, i) => (i === index ? data.text : line)) : lines
      const newVeils = type === "veil" ? veils?.map((veil, i) => (i === index ? data.text : veil)) : veils
      updateGameState({
        safety: {
          lines: newLines || [],
          veils: newVeils || [],
        },
      })
      toast.success(`${type === "line" ? "Line" : "Veil"} edited: ${text} → ${data.text}`)
      reset()
    }
  
    const remove = (type: "line" | "veil", text: string) => {
      const newLines = type === "line" ? lines?.filter((line) => line !== text) : lines || [];
          const newVeils = type === "veil" ? veils?.filter((veil) => veil !== text) : veils || [];
      updateGameState({
        safety: {
          lines: newLines,
          veils: newVeils,
        },
      })
      toast.success(`${type === "line" ? "Line" : "Veil"} removed: ${text}`)
    }
  
    return (
      <form onSubmit={handleSubmit(edit)} className="w-full flex gap-2">
        <input type="text" defaultValue={text} {...register("text")} className="w-full" />
        <button
          type="submit"
          className="w-fit bg-theme-bg-primary text-theme-text-primary px-4 py-2 rounded-lg opacity-80 hover:opacity-100 border border-theme-border hover:bg-theme-bg-accent hover:border border-2-theme-border border-2-accent hover:text-theme-text-accent"
        >
          ✓
        </button>
        <button
                          type="button"
                          className="w-fit bg-theme-bg-primary text-theme-text-primary px-4 py-2 rounded-lg opacity-80 hover:opacity-100 border border-theme-border hover:bg-theme-bg-accent hover:border border-2-theme-border border-2-accent hover:text-theme-text-accent"
                          onClick={() => remove(type, text)}
                        >
                          X
                        </button>
      </form>
    )
  }
  
  function AddLineOrVeilForm() {
    const { gameState, updateGameState } = useGame()
    const { lines, veils } = gameState.safety || { lines: [], veils: [] }
    const { register, handleSubmit, reset } = useForm<{
      text: string
      type: "line" | "veil"
    }>({
      defaultValues: {
        text: "",
        type: "line",
      },
    })
  
    const addLineVeil = (formInput: { text: string; type: "line" | "veil" }) => {
      const newLines = formInput.type === "line" ? [...(lines || []), formInput.text] : lines
      const newVeils = formInput.type === "veil" ? [...(veils || []), formInput.text] : veils
      const safety = 
        {...newLines ? { lines: newLines } : {}, 
        ...newVeils ? { veils: newVeils } : {}}
      updateGameState({
        ...gameState,
        safety: {
          ...gameState.safety,
          ...safety,
        },
      })
      toast.success(`${formInput.type === "line" ? "Line" : "Veil"} added: ${formInput.text}`)
      reset()
    }
    return (
      <form onSubmit={handleSubmit(addLineVeil)}>
        <h3 className="text-lg font-bold text-theme-text-accent">Add a Line or Veil</h3>
        <p className="text-sm text-left mb-2">
          Text is submitted exactly as it is written below. All lines and veils are anonymous, and visible to the entire
          group.
        </p>
        <input type="text" placeholder="Enter line or veil..." className="w-full" {...register("text")} />
        <div className="flex gap-2 justify-center">
          <div className="flex gap-2 items-center justify-start">
            <input type="radio" {...register("type")} value="line" id="type-line"/>
            <label htmlFor="type-line">Line</label>
          </div>
          <div className="flex gap-2 items-center justify-start">
            <input type="radio" {...register("type")} value="veil" id="type-veil" />
            <label htmlFor="type-veil">Veil</label>
          </div>
        </div>
        <button
          type="submit"
         className="gridButton"
        >
          Add
        </button>
      </form>
    )
  }
  
  function ExplainerSections() {
    const [view, setView] = useState<"none" | "open-door" | "x-card" | "lines-veils">("none")
    return (
      <div className="w-full flex flex-col md:grid md:grid-cols-3 gap-2 p-4 pb-12 md:pb-4">
        <button
          type="button"
          className="gridButton"
          onClick={() => setView("open-door")}
        >
          Open Door Policy
        </button>
        <button
          type="button"
          className="gridButton"
          onClick={() => setView("x-card")}
        >
          X-Card
        </button>
        <button
          type="button"
          className="gridButton"
          onClick={() => setView("lines-veils")}
        >
          Lines and Veils
        </button>
        <div className="col-span-3 text-left">
          {view === "open-door" && (
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-theme-text-accent text-center">Open Door Policy</h3>
              <p>
                {" "}
                The Open Door Policy is very simple: you can leave the game for any reason and you don’t have to explain
                yourself. Just tell the group you have to go; no one here will ask any questions about it.
              </p>
            </div>
          )}
  
          {view === "x-card" && (
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-theme-text-accent text-center">X-Card</h3>
              <p>
                {" "}
                Because tabletop gaming is improvisational, we may encounter themes or topics not anticipated by other
                safety tools. The X-card is useful in case something in the game makes you feel uncomfortable in an un-fun
                way. Just tap or hold up the X-card and we will stop play in order to change whatever just happened in the
                game. The Keeper may ask for clarification on what is being X-carded, but will never ask why. Play resumes
                once the change is made.
              </p>
  
              <p className="italic text-sm text-theme-text-muted">
                The X-Card was developed by <a href="http://tinyurl.com/x-card-rpg">John Stavropoulos</a>.
              </p>
            </div>
          )}
  
          {view === "lines-veils" && (
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-theme-text-accent text-center">Lines and Veils</h3>
              <p>
                {" "}
                Lines and Veils are tools to pre-emptively establish boundaries around sensitive subject matter. Lines are
                things that we are not going to have in the game, period. Veils are things that we're ok with being in the
                game world but we prefer not to roleplay them, or we simply want to keep them offscreen. Lines and Veils
                can be added anonymously in this tab and will be seen by all players. Importantly, even the subjects
                listed as inherent to the game can still be lined or veiled.
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }