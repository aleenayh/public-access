import React, {
	createContext,
	type ReactNode,
	useContext,
	useState,
} from "react";
import z from "zod";

// Context value includes state AND actions
interface PreferencesContextValue {
	prefersReducedMotion: boolean;
	prefersImmediateDice: boolean;
	saveMotionPreference: (prefersReducedMotion: boolean) => void;
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
	})
	.catch({
		prefersReducedMotion: false,
		prefersImmediateDice: false,
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

	const saveMotionPreference = (prefersReducedMotion: boolean) => {
		setPrefersReducedMotion(prefersReducedMotion);
		localStorage.setItem(
			"public-access-user-preferences",
			JSON.stringify({
				prefersReducedMotion,
				prefersImmediateDice,
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
			}),
		);
	};

	// Context value
	const value: PreferencesContextValue = {
		prefersReducedMotion,
		prefersImmediateDice,
		saveMotionPreference,
		saveImmediateDicePreference,
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
