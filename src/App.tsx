import "./App.css";
import { Tooltip } from "radix-ui";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Game } from "./components/Game";
import { LandingPage } from "./components/LandingPage";
import { GameProvider } from "./context/GameContext";
import { PreferencesProvider } from "./context/PreferencesContext";
import { type GameState, PlayerRole, type UserInfo } from "./context/types";
import ErrorBoundary from "./ErrorBoundary";
import { nameToPlayerId } from "./lib/firebase";
import { BackgroundAnimations } from "./components/BackgroundAnimations";

function App() {
	const searchParams = new URLSearchParams(window.location.search);
	const initialGameHash = searchParams.get("gameHash");
	// Get saved user info if returning to a game via URL
	const savedName = localStorage.getItem(`playerName_${initialGameHash}`) || "";
	const savedRole = (localStorage.getItem(`playerRole_${initialGameHash}`) ?? localStorage.getItem(`playerRole`)) as typeof PlayerRole | null;
	const [gameHash, setGameHash] = useState<string | null>(initialGameHash);
	const [startingState, setStartingState] = useState<GameState | null>(null);
	const [userName, setUserName] = useState<string | null>(savedName ?? null);
	const userRole = savedRole ?? PlayerRole.PLAYER;
	const [userId, setUserId] = useState<string | null>(
		savedName ? nameToPlayerId(savedName) : null,
	);

	const savedTheme = localStorage.getItem("theme") || "analog";
	document.documentElement.setAttribute("data-theme", savedTheme);

	if (!gameHash || !userName || !userId) {
		return (
			<PreferencesProvider>
			<LandingPage
				setGameHash={setGameHash}
				userName={userName}
				userId={userId}
				setUserName={setUserName}
				setUserId={setUserId}
				setStartingState={setStartingState}
			/>
			</PreferencesProvider>
		);
	}

	const userInfo: UserInfo = {
		id: userId,
		name: userName,
		role: userRole as typeof PlayerRole[keyof typeof PlayerRole],
	};

	return (
		<div className="App">
			<ErrorBoundary>
				<PreferencesProvider>
				<BackgroundAnimations/>
				<GameProvider
					gameHash={gameHash}
					userInfo={userInfo}
					startingState={startingState}
				>
					<Tooltip.Provider>
						<Toaster />
						<Game />
					</Tooltip.Provider>
				</GameProvider>
				</PreferencesProvider>
			</ErrorBoundary>
		</div>
	);
}

export default App;
