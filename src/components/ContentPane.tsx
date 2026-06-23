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
import { SettingsSheet } from "./collapsiblePanes/SettingsSheet"
import { OdysseyTapesSheet } from "./collapsiblePanes/OdysseyTapesSheet"
import { TVOdysseyMysterySheet } from "./collapsiblePanes/TVOdysseyMysterySheet"

export function ContentPane() {
    const [contentTitle, setContentTitle] = useState<string | null>("Mysteries");
    const [contents, setContents] = useState<React.ReactNode | null>(<MysteryPane/>);

    const onClick = (title: string, content: React.ReactNode) => {
            setContentTitle(title);
            setContents(content);
    }

    return (
        <StyledPane>
            <div className="-mt-4 -mx-4 flex align-center justify-stretch gap-1 mb-4 relative overflow-visible h-fit items-start border-b border-theme-border isolate">
            <button type="button" className={`navButton ${contentTitle === "Mysteries" ? "activeNav" : ""}`} onClick={() => onClick("Mysteries", <MysteryPane/>)}>
                <MagnifyingGlass height={24}/> <TextOnHover text="Mysteries" expanded={contentTitle === "Mysteries"} />
            </button>
            <button type="button" className={`navButton ${contentTitle === "Reference Sheet" ? "activeNav" : ""}`} onClick={() => onClick("Reference Sheet", <ReferenceSheet/>)}>
                <Book height={24}/> <TextOnHover text="Reference Sheet" expanded={contentTitle === "Reference Sheet"} />
            </button>
            <button type="button" className={`navButton ${contentTitle === "TV Odyssey Mystery" ? "activeNav" : ""}`} onClick={() => onClick("TV Odyssey Mystery", <TVOdysseyMysterySheet/>)}>
                <Television height={24}/> <TextOnHover text="TV Odyssey Mystery" expanded={contentTitle === "TV Odyssey Mystery"} />
            </button>
            <button type="button" className={`navButton ${contentTitle === "Odyssey Tapes" ? "activeNav" : ""}`} onClick={() => onClick("Odyssey Tapes", <OdysseyTapesSheet/>)}>
                <VHS height={24}/> <TextOnHover text="Odyssey Tapes" expanded={contentTitle === "Odyssey Tapes"} />
            </button>
            <button type="button" className={`navButton ${contentTitle === "Personal Notes" ? "activeNav" : ""}`} onClick={() => onClick("Personal Notes", <NotesSheet/>)}>
                <Pencil height={24}/> <TextOnHover text="Personal Notes" expanded={contentTitle === "Personal Notes"} />
            </button>

            <button type="button" className={`navButton ${contentTitle === "Safety Tools" ? "activeNav" : ""}`} onClick={() => onClick("Safety Tools", <SafetySheet/>)}>
                <Heartshield height={24}/> <TextOnHover text="Safety Tools" expanded={contentTitle === "Safety Tools"} />
				</button>
				<button type="button" className={`navButton ${contentTitle === "Settings" ? "activeNav" : ""}`} onClick={() => onClick("Settings", <SettingsSheet/>)}>
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