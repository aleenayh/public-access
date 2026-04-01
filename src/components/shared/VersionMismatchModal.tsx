import { Dialog } from "radix-ui";

interface VersionMismatchModalProps {
	isOpen: boolean;
	localVersion: string;
	remoteVersion: string;
}

/**
 * Modal displayed when schema version mismatch is detected
 * Non-dismissible - user must reload the app
 */
export function VersionMismatchModal({
	isOpen,
	localVersion,
	remoteVersion,
}: VersionMismatchModalProps) {
	const handleReload = () => {
		window.location.reload();
	};

	return (
		<Dialog.Root open={isOpen} onOpenChange={() => {}}>
			<Dialog.Portal>
				<Dialog.Overlay className="DialogOverlay" style={{ zIndex: 100 }} />
				<Dialog.Content
					className="DialogContent"
					style={{ zIndex: 101 }}
					onEscapeKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => e.preventDefault()}
					onPointerDownOutside={(e: React.PointerEvent<HTMLDivElement>) => e.preventDefault()}
					onInteractOutside={(e: React.PointerEvent<HTMLDivElement>) => e.preventDefault()}
				>
					<Dialog.Title className="DialogTitle">Refresh Required</Dialog.Title>
					<Dialog.Description className="DialogDescription">
						Your browser tab is running an outdated version of the app. To
						prevent data corruption, please reload to get the latest version.
					</Dialog.Description>
					<div className="flex flex-col gap-4 mt-4">
						<div className="text-sm text-theme-text-secondary">
							<div>
								<strong>Your version:</strong> {localVersion || "Unknown"}
							</div>
							<div>
								<strong>Required version:</strong> {remoteVersion || "Unknown"}
							</div>
						</div>
						<button
							type="button"
							onClick={handleReload}
							className="bg-theme-bg-accent text-theme-text-primary rounded-md p-3 font-semibold hover:opacity-90 transition-opacity"
						>
							Reload
						</button>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
