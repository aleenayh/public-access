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
    
    return (
        <div><h1 className="text-[2rem] font-bold text-theme-text-accent mb-6">
            Notes
        </h1>
            <div className="flex flex-col gap-4 justify-between h-full">
                <p className="text-balance">
                    These personal notes are not shared with other players.
                </p>
                <textarea
                    className=" bg-theme-bg-primary text-theme-text-primary border-2 border-theme-border-accent rounded-lg p-2 w-full h-full"
                    defaultValue={notes}
                    onBlur={(e) => setNotes(e.target.value)}
                />
                <button type="button" className="formButton"
                    onClick={saveLocal}
                >
                    {buttonText}
                </button>
                <p className="text-sm md:text-md w-full md:w-1/2 mx-auto italic">
                    Notes are saved locally. They will not persist if you change
                    devices and can be lost if you clear cache.
                </p>
            </div>
        </div>)
}