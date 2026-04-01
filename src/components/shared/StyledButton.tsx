export function StyledButton({ children, onClick, disabled }: { children: React.ReactNode, onClick: () => void, disabled?: boolean }) {

  //TODO clearly 
  
  return (
    <button type="button" className="bg-red-600" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}