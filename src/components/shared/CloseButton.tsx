export function CloseButton({onClick}: {onClick?: () => void}) {
    return (
      <button
        type="button"
        className="absolute top-2 right-2 aspect-square w-8 h-8 bg-theme-bg-secondary hover:bg-theme-bg-accent text-theme-text-primary rounded-full flex justify-center items-center"
        onClick={onClick}
        aria-label="Close"
      >
        X
      </button>
    )
  }