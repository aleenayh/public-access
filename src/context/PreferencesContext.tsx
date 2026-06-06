import React, {
	createContext,
	type ReactNode,
	useContext,
	useState,
} from "react";
import z from "zod";

type ThemeOptions = "eighties" | "light" | "analog" | "forum" | "dark";
interface PreferencesContextValue {
	prefersReducedMotion: boolean;
	prefersImmediateDice: boolean;
	theme: ThemeOptions;
	saveMotionPreference: (prefersReducedMotion: boolean) => void;
	saveTheme: (theme: ThemeOptions) => void;
	saveImmediateDicePreference: (prefersImmediateDice: boolean) => void;
}

// Create context
const PreferencesContext = createContext<PreferencesContextValue | undefined>(
	undefined,
); // Provider props

interface PreferencesProviderProps {
	children: ReactNode;
}

const savedPreferenceSchema = z
	.object({
		prefersReducedMotion: z.boolean(),
		prefersImmediateDice: z.boolean(),
		theme: z.enum(["eighties", "light", "analog", "forum", "dark"]),
	})
	.catch({
		prefersReducedMotion: false,
		prefersImmediateDice: false,
		theme: "analog",
	});


export const PreferencesProvider: React.FC<PreferencesProviderProps> = ({
	children,
}) => {
	const QUERY = "(prefers-reduced-motion: no-preference)";
	const mediaQueryList = window.matchMedia(QUERY);
	const osPrefersReducedMotion = !mediaQueryList.matches;
	const savedPreferences = savedPreferenceSchema.parse(
		JSON.parse(localStorage.getItem("public-access-user-preferences") || "{}"),
	);

	const [prefersReducedMotion, setPrefersReducedMotion] = useState(
		savedPreferences.prefersReducedMotion ?? osPrefersReducedMotion,
	);
	const [prefersImmediateDice, setPrefersImmediateDice] = useState(
		savedPreferences.prefersImmediateDice,
	);
	const [theme, setTheme] = useState<ThemeOptions>(
		savedPreferences.theme ?? "analog",
	);
	document.documentElement.setAttribute("data-theme", theme);
	const saveMotionPreference = (prefersReducedMotion: boolean) => {
		setPrefersReducedMotion(prefersReducedMotion);
		localStorage.setItem(
			"public-access-user-preferences",
			JSON.stringify({
				prefersReducedMotion,
				prefersImmediateDice,
				theme
			}),
		);
	};
	const saveImmediateDicePreference = (prefersImmediateDice: boolean) => {
		setPrefersImmediateDice(prefersImmediateDice);
		localStorage.setItem(
			"public-access-user-preferences",
			JSON.stringify({
				prefersReducedMotion,
				prefersImmediateDice,
				theme
			}),
		);
	};
	const saveTheme = (theme: ThemeOptions) => {
		setTheme(theme);
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem(
			"public-access-user-preferences",
			JSON.stringify({ theme, prefersReducedMotion, prefersImmediateDice }),
		);
	};
	// Context value
	const value: PreferencesContextValue = {
		prefersReducedMotion,
		prefersImmediateDice,
		saveMotionPreference,
		saveImmediateDicePreference,
		theme,
		saveTheme,
	};

	return (
		<PreferencesContext.Provider value={value}>
			{children}
		</PreferencesContext.Provider>
	);
};

/**
 * Custom hook to access preferences context
 */
export const usePreferences = (): PreferencesContextValue => {
	const context = useContext(PreferencesContext);

	if (!context) {
		throw new Error("usePreferences must be used within a PreferencesProvider");
	}

	return context;
};
