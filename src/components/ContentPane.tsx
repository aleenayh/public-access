import { Book } from "./svgs/Book"
import { MagnifyingGlass } from "./svgs/MagnifyingGlass"
import { Television } from "./svgs/Television"
import { VHS } from "./svgs/VHS"
import { Pencil } from "./svgs/Pencil"
import { Heartshield } from "./svgs/Heartshield"
import { Cog } from "./svgs/Cog"
import { ReferenceSheet } from "./collapsiblePanes/ReferenceSheet"
import { NotesSheet } from "./collapsiblePanes/NotesSheet"
import { SafetySheet } from "./collapsiblePanes/SafetySheet"
import { useState } from "react"
import { MysteryPane } from "./MysteryPane"
import { StyledPane } from "./shared/StyledPane"

export function ContentPane() {
    const [contentTitle, setContentTitle] = useState<string | null>("Mysteries");
    const [contents, setContents] = useState<React.ReactNode | null>(<MysteryPane/>);

    const onClick = (title: string, content: React.ReactNode) => {
            setContentTitle(title);
            setContents(content);
    }

    const buttonClasses = "group flex items-center justify-center transition-all transition-duration-300 ease-in-out hover:bg-theme-bg-accent w-fit px-2 py-1 rounded-tr-md rounded-tl-md border border-b-0 border-theme-border" 
    return (
        <StyledPane variant="vertical">
            <div className="-mt-4 -ml-4 flex align-center justify-start gap-1 mb-4 relative overflow-clip h-fit items-start">
            <button type="button" className={`${buttonClasses} pl-4 ${contentTitle === "Mysteries" ? "bg-theme-bg-primary/90 flex-1" : "bg-theme-bg-secondary"}`} onClick={() => onClick("Mysteries", <MysteryPane/>)}>
                <MagnifyingGlass height={24}/> <TextOnHover text="Mysteries" expanded={contentTitle === "Mysteries"} />
            </button>
            <button type="button" className={`${buttonClasses} ${contentTitle === "Reference Sheet" ? "bg-theme-bg-primary/90 flex-1" : "bg-theme-bg-secondary"}`} onClick={() => onClick("Reference Sheet", <ReferenceSheet/>)}>
                <Book height={24}/> <TextOnHover text="Reference Sheet" expanded={contentTitle === "Reference Sheet"} />
            </button>
            <button type="button" className={`${buttonClasses} ${contentTitle === "TV Odyssey Mystery" ? "bg-theme-bg-primary/90" : "bg-theme-bg-secondary"}`} onClick={() => { }}>
                <Television height={24}/> <TextOnHover text="TV Odyssey Mystery" expanded={contentTitle === "TV Odyssey Mystery"} />
            </button>
            <button type="button" className={`${buttonClasses} ${contentTitle === "Odyssey Tapes" ? "bg-theme-bg-primary/90 flex-1" : "bg-theme-bg-secondary"}`} onClick={() => { }}>
                <VHS height={24}/> <TextOnHover text="Odyssey Tapes" expanded={contentTitle === "Odyssey Tapes"} />
            </button>
            <button type="button" className={`${buttonClasses} ${contentTitle === "Personal Notes" ? "bg-theme-bg-primary/90 flex-1" : "bg-theme-bg-secondary"}`} onClick={() => onClick("Personal Notes", <NotesSheet/>)}>
                <Pencil height={24}/> <TextOnHover text="Personal Notes" expanded={contentTitle === "Personal Notes"} />
            </button>

            <button type="button" className={`${buttonClasses} ${contentTitle === "Safety Tools" ? "bg-theme-bg-primary/90 flex-1" : "bg-theme-bg-secondary"}`	} onClick={() => onClick("Safety Tools", <SafetySheet/>)}>
                <Heartshield height={24}/> <TextOnHover text="Safety Tools" expanded={contentTitle === "Safety Tools"} />
				</button>
				<button type="button" className={`${buttonClasses} ${contentTitle === "Settings" ? "bg-theme-bg-primary/90 flex-1" : "bg-theme-bg-secondary"}`} onClick={() => { }}>
                <Cog height={24}/> <TextOnHover text="Settings" expanded={contentTitle === "Settings"} />
            </button>

            </div>
			<div className="h-full w-full fadeInEachChild overflow-y-auto">{contents}</div>
		</StyledPane>
    )
}

function TextOnHover({ text, expanded }: { text: string, expanded: boolean }) {
    return (
        <><span className={` ${expanded ? "w-fit px-4" : "w-0 p-0 group-hover:w-fit group-hover:px-4"} whitespace-nowrap overflow-hidden transition-all transition-duration-300 ease-in-out text-md text-theme-text-muted `}>{text}</span>
            <span className="sr-only">{text}</span>
            </>
    )
} 