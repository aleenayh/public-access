export function StyledPane({ children }: { children: React.ReactNode }) {
	return (
		<div className={`flex-1 h-full rounded-md p-4 border border-theme-border flex scrollbar-gutter-stable w-full flex-col bg-theme-bg-primary/90`}>
			{children}
		</div>
	);
}