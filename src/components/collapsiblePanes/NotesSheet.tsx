import { toast } from "react-hot-toast";
import { useGame } from "../../context/GameContext";
import { useState } from "react";

export function NotesSheet() {
    const { gameHash } = useGame();
	const localNotes = localStorage.getItem(`PublicAccess_notes_${gameHash}`);
	const [notes, setNotes] = useState(localNotes || "");
	const [buttonText, setButtonText] = useState("Save");

	const saveLocal = () => {
		setButtonText("Saving...");
		localStorage.setItem(`PublicAccess_notes_${gameHash}`, notes);
		setTimeout(() => {
			toast.success("Notes saved!");
			setButtonText("Saved!");
		}, 1000);
		setTimeout(() => {
			setButtonText("Save");
		}, 3000);
    };
    const saveOnBlur = (e:React.FocusEvent<HTMLTextAreaElement, Element>) => {
        setNotes(e.target.value)
        localStorage.setItem(`PublicAccess_notes_${gameHash}`, e.target.value);
        
    }
    
    return (
            <div className="flex flex-col gap-4 justify-stretch h-full">
                <p className="text-balance">
                    These personal notes are not shared with other players.
                </p>
                <textarea
                    className="flex-1 grow bg-theme-bg-primary text-theme-text-primary border-2 border-theme-border-accent rounded-lg p-2 w-full h-full"
                    defaultValue={notes}
                onBlur={(e) => saveOnBlur(e)}
                />
                <button type="button" className="formButton"
                    onClick={saveLocal}
                >
                    {buttonText}
                </button>
                <p className="text-sm md:text-md w-full md:w-1/2 mx-auto italic text-theme-text-muted">
                    Notes are saved locally. They will not persist if you change
                    devices and can be lost if you clear cache.
                </p>
            </div>
        )
}