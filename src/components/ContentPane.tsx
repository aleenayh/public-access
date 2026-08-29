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
import { MysteryPane, MysteryContent } from "./MysteryPane"
import { StyledPane } from "./shared/StyledPane"
import { SettingsSheet } from "./collapsiblePanes/SettingsSheet"
import { OdysseyTapesSheet } from "./collapsiblePanes/OdysseyTapesSheet"
import { CharacterInterior } from "./characters/CharacterPane"
import { Latchkey } from "./svgs/Keys"
import { CharacterCreateModal } from "./characters/CharacterCreateModal"

type ContentItem = {
    title: string
    icon: React.ComponentType<{ height?: number; width?: number }>
    content: () => React.ReactNode
    mobileOnly?: boolean
}

const CONTENT_ITEMS: ContentItem[] = [
    {
        title: "Mysteries",
        icon: MagnifyingGlass,
        content: () => <MysteryPane />,
    },
    {
        title: "Latchkeys",
        icon: Latchkey,
        content: () => <CharacterInterior />,
        mobileOnly: true,
    },
    {
        title: "Reference Sheet",
        icon: Book,
        content: () => <ReferenceSheet />,
    },
    {
        title: "TV Odyssey Mystery",
        icon: Television,
        content: () => <MysteryContent mysteryId="tv-odyssey-mystery" />,
    },
    {
        title: "Odyssey Tapes",
        icon: VHS,
        content: () => <OdysseyTapesSheet />,
    },
    {
        title: "Personal Notes",
        icon: Pencil,
        content: () => <NotesSheet />,
    },
    {
        title: "Safety Tools",
        icon: Heartshield,
        content: () => <SafetySheet />,
    },
    {
        title: "Settings",
        icon: Cog,
        content: () => <SettingsSheet />,
    },
]

export function ContentPane() {
    const [contentTitle, setContentTitle] = useState("Mysteries")

    const selectedItem = CONTENT_ITEMS.find((item) => item.title === contentTitle) ?? CONTENT_ITEMS[0]

    const Content = selectedItem.content

    return (
        <StyledPane>
            <CharacterCreateModal showTrigger={false} />
            <div className="-mt-4 -mx-4 flex justify-stretch gap-1 mb-4 overflow-visible h-fit items-start border-b border-theme-border isolate flex-wrap md:flex-nowrap">
                {CONTENT_ITEMS.map((item) => {
                    const active = contentTitle === item.title
                    const button = (
                        <ControlPaneTab item={item} active={active} onClick={() => setContentTitle(item.title)} />
                    )
                    return item.mobileOnly ? (
                        <div key={item.title} className="block md:hidden">
                            {button}
                        </div>
                    ) : (
                        button
                    )
                })}
            </div>

            <div className="h-screen w-full fadeInEachChild overflow-y-auto">
                <Content />
            </div>
        </StyledPane>
    )
}

function ControlPaneTab({
    item,
    active,
    onClick,
}: {
    item: ContentItem
    active: boolean
    onClick?: React.MouseEventHandler<HTMLButtonElement>
}) {
    const Icon = item.icon
    return (
        <button
            key={item.title}
            type="button"
            className={`navButton group ${active ? "activeNav" : ""}`}
            onClick={onClick}>
            <span className="shrink-0">
                <Icon height={24} />
            </span>

            <TextOnHover text={item.title} expanded={active} />
        </button>
    )
}

function TextOnHover({ text, expanded }: { text: string; expanded: boolean }) {
    return (
        <>
            <span
                className={`
                    whitespace-nowrap
                    overflow-hidden
                    text-md
                    text-theme-text-muted
                    transition-[max-width,opacity,margin]
                    duration-300
                    ease-out

                    ${
                        expanded
                            ? `
                                ml-3
                                max-w-56
                                opacity-100
                            `
                            : `
                                ml-0
                                max-w-0
                                opacity-0

                                group-hover:ml-2
                                group-hover:max-w-48
                                group-hover:opacity-80

                                group-hover:delay-200
                            `
                    }
                `}>
                {text}
            </span>

            <span className="sr-only">{text}</span>
        </>
    )
}
