export function StyledPane({ children, variant }: { children: React.ReactNode, variant: "vertical" | "horizontal" }) {
	return (
		<div className={`flex-1 max-h-full bg-theme-bg-primary/90 rounded-md p-4 border border-theme-border flex ${variant === "vertical" ? "max-w-1/2 flex-col" : ""}`}>
			{children}
		</div>
	);
}