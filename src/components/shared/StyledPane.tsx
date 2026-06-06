export function StyledPane({ children, variant }: { children: React.ReactNode, variant: "vertical" | "horizontal" }) {
	return (
		<div className={`flex-1 bg-theme-bg-primary/90 rounded-md p-4 border border-theme-border flex flex-col ${variant === "vertical" ? "max-w-1/2" : ""}`}>
			{children}
		</div>
	);
}