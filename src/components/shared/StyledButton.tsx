export function StyledButton({ children, onClick, disabled }: { children: React.ReactNode, onClick: () => void, disabled?: boolean }) {

  //TODO clearly 
  
  return (
    <button type="button" className="bg-theme-bg-primary text-theme-text-secondary rounded-md p-2 border border-theme-border hover:bg-theme-bg-accent hover:text-theme-text-accent transition-colors whitespace-normal flex flex-col" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}