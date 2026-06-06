import QuillIcon from "../assets/icons/quill.svg?react"
import TelevisionIcon from "../assets/icons/television.svg?react"
import HeartshieldIcon from "../assets/icons/heartshield.svg?react"
import BookIcon from "../assets/icons/book.svg?react"
import GroupIcon from "../assets/icons/group.svg?react"   

export function FooterNav() {
    return (
        <div className="align-bottom flex justify-evenly items-center px-4 py-1 -mb-4 text-theme-text-accent bg-theme-bg-secondary rounded-t-md">
            <TelevisionIcon height={24}/>
            <BookIcon height={24}/>
            <QuillIcon height={24}/>
            <HeartshieldIcon height={24}/>
            <BookIcon height={24}/>
            <GroupIcon height={24}/>

        </div>
    )
}