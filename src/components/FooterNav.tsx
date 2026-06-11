import QuillIcon from "../assets/icons/quill.svg?react"
import TelevisionIcon from "../assets/icons/television.svg?react"
import HeartshieldIcon from "../assets/icons/heartshield.svg?react"
import BookIcon from "../assets/icons/book.svg?react" 
import CogIcon from "../assets/icons/cog.svg?react"
import VHSIcon from "../assets/icons/vhs.svg?react"
import { ReferenceSheet } from "./collapsiblePanes/ReferenceSheet"
import { NotesSheet } from "./collapsiblePanes/NotesSheet"
import { SafetySheet } from "./collapsiblePanes/SafetySheet"
import { useState } from "react"

export function FooterNav() {
    const [isOpen, setIsOpen] = useState(false);
    const [contentTitle, setContentTitle] = useState<string | null>(null);
    const [contents, setContents] = useState<React.ReactNode | null>(null);

    const onClick = (title: string, content: React.ReactNode) => {
        if (!isOpen) {
            setIsOpen(true);
            setContents(content);
            setContentTitle(title);
        } else if (isOpen && contentTitle === contentTitle) {
            setIsOpen(false);
            setContents(null);
            setContentTitle(null);
        } else {
            setContents(content);
            setContentTitle(title);
        }
    }

    const buttonClasses = "group flex items-center justify-center transition-all transition-duration-300 ease-in-out bg-theme-bg-secondary hover:bg-theme-bg-accent w-fit px-2 py-1 rounded-tr-md rounded-tl-md" 
    return (
        <div className="h-fit flex flex-col relative">
        <div className="hidden md:flex align-bottom justify-start gap-1 pt-1 -mb-4 relative overflow-clip h-fit items-start">
            <button type="button" className={buttonClasses} onClick={() => onClick("Reference Sheet", <ReferenceSheet/>)}>
                <BookIcon height={24}/> <TextOnHover text="Reference Sheet" />
            </button>
            <button type="button" className={buttonClasses} onClick={() => { }}>
                <TelevisionIcon height={24}/> <TextOnHover text="TV Odyssey Mystery" />
            </button>
            <button type="button" className={buttonClasses} onClick={() => { }}>
                <VHSIcon height={24}/> <TextOnHover text="Odyssey Tapes" />
            </button>
            <button type="button" className={buttonClasses} onClick={() => onClick("Personal Notes", <NotesSheet/>)}>
                <QuillIcon height={24}/> <TextOnHover text="Personal Notes" />
            </button>
            <button type="button" className={buttonClasses} onClick={() => { }}>
                <CogIcon height={24}/> <TextOnHover text="Settings" />
            </button>
            <button type="button" className={buttonClasses} onClick={() => onClick("Safety Tools", <SafetySheet/>)}>
                <HeartshieldIcon height={24}/> <TextOnHover text="Safety Tools" />
            </button>

            </div>
            {isOpen && contents && <div className="absolute top-[26px] left-0 w-full h-full bg-theme-bg-secondary/50 p-2">{contents}</div>}
            </div>
    )
}

function TextOnHover({ text }: { text: string }) {
    return (
        <><span className="w-0 p-0 group-hover:w-fit whitespace-nowrap overflow-hidden transition-all transition-duration-300 ease-in-out text-md text-theme-text-muted group-hover:px-4">{text}</span>
            <span className="sr-only">{text}</span>
            </>
    )
} 