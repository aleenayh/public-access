import { Component, type ErrorInfo } from "react";

interface Props {
	children: React.ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("ErrorBoundary caught an error: ", error, errorInfo);
		this.setState({ hasError: true, error: error });
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="flex flex-col gap-2 justify-center items-center">
					<h1>Something went wrong.</h1>
					<p className="text-theme-text-muted font-mono">
						ERROR: {this.state.error?.message}
					</p>
					<p>
						Try reloading your page. If the error persists, contact us on
						Discord.
					</p>
					<button
						type="button"
						onClick={() => window.location.reload()}
						className="bg-theme-bg-accent border-2 border-theme-border-accent hover:bg-theme-bg-accent transition-colors flex justify-center items-center rounded-lg p-2 gap-2"
					>
						Reload
					</button>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
