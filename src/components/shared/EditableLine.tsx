import { useState } from "react"

export function EditableLine({
  text,
  editable,
  onSave,
  index,
}: {
  text: string
  editable: boolean
  onSave: (index: number, value: string) => void
  index: number
}) {
  const [showEdit, setShowEdit] = useState(false)

  const handleSave = (value: string) => {
    onSave(index, value)
    setShowEdit(false)
  }

  const showBlank = text === ""

  return (
    <div className="inline-flex justify-between items-center gap-2">
      <span className="text-sm text-theme-text-muted">◆</span>
      {showEdit ? (
        <Input text={text} onSave={(value) => handleSave(value)} />
      ) : (
        <div className="grow w-[60%] flex gap-2 items-center ">
          {showBlank ? (
            <BlankLine />
          ) : (
            <span className="grow w-[60%] text-md text-theme-text-primary flex justify-start text-left">
              {text}
            </span>
          )}
        </div>
      )}
      {editable && <PencilIconButton isEditing={showEdit} setIsEditing={() => setShowEdit(!showEdit)} />}
    </div>
  )
}

function Input({
  text,
  onSave,
  placeholder = "",
}: {
  text: string
  onSave: (value: string) => void
  placeholder?: string
}) {
  const [localText, setLocalText] = useState(text)

  const isDirty = localText !== text

  const handleSave = () => {
    if (isDirty) {
      onSave(localText)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave()
      if (e.target instanceof HTMLElement) {
        e.target.blur()
      }
    }
    if (e.key === "Escape") {
      setLocalText(text)
      if (e.target instanceof HTMLElement) {
        e.target.blur()
      }
    }
  }

  return (
    <div className="flex-1 min-w-0 relative flex items-center gap-2">
      <input
        type="text"
        value={localText}
        onChange={(e) => setLocalText(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full min-w-0 border px-2 py-1 rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent hover:text-theme-text-accent ${
          isDirty ? "border-yellow-500/50" : "border-theme-border"
        }`}
      />
      {isDirty && (
        <span className="text-yellow-500 text-xs shrink-0" title="Unsaved - press Enter">
          ●
        </span>
      )}
    </div>
  )
}

function BlankLine() {
  return <div className="flex-1 min-w-0 h-[1.5em] border-b border-theme-text-muted" />
}

function PencilIconButton({
	isEditing,
	setIsEditing,
}: {
	isEditing: boolean;
	setIsEditing: (isEditing: boolean) => void;
}) {
	return (
		<button
			type="button"
			onClick={() => setIsEditing(!isEditing)}
			className="p-1 hover:bg-theme-bg-accent hover:text-theme-text-accent rounded-lg"
			aria-label={isEditing ? "Done editing" : "Edit value"}
		>
			{isEditing ? (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<polyline points="20 6 9 17 4 12" />
				</svg>
			) : (
				<PencilIcon/>
			)}
		</button>
	);
}

const PencilIcon = () => <svg
xmlns="http://www.w3.org/2000/svg"
width="16"
height="16"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
strokeWidth="2"
strokeLinecap="round"
strokeLinejoin="round"
aria-hidden="true"
>
<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
<path d="m15 5 4 4" />
</svg>

export function CheckableEditableLine({
    text,
    editable,
    onSave,
    onCheck,
    checked,
    index,
  }: {
    text: string
    editable: boolean
    onSave: (index: number, value: string) => void
    onCheck: (index: number, checked: boolean) => void
    checked: boolean
    index: number
  }) {
    const [showEdit, setShowEdit] = useState(false)
  
    const handleSave = (value: string) => {
      onSave(index, value)
      setShowEdit(false)
    }
  
    const showBlank = text === ""
  
    return (
      <div className="inline-flex justify-between items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          disabled={!editable || text === ""}
          onChange={(e) => onCheck(index, e.target.checked)}
        />
        {showEdit ? (
          <Input text={text} onSave={(value) => handleSave(value)} />
        ) : (
          <div className="grow w-[60%] flex gap-2 items-center ">
            {showBlank ? (
              <BlankLine />
            ) : (
              <span
                className={`grow w-[60%] text-md text-theme-text-primary flex justify-start  text-left ${checked ? "line-through" : ""}`}
              >
                {text}
              </span>
            )}
          </div>
        )}
        {editable && <PencilIconButton isEditing={showEdit} setIsEditing={() => setShowEdit(!showEdit)} />}
      </div>
    )
  }