import { useMemo } from "react";
import { usePreferences } from "../../context/PreferencesContext";


export function AnimatedHeader({text} : {text: string}) {
    const {theme} = usePreferences();
	const title = useMemo(() => {
		return text.split("").map((letter, index) => (
          <span data-letter={letter} className="animatedHeaderLetter" key={index}>{letter}</span>
		));
	//force entry animations on theme change
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [theme])

    return (
        <div className="isolate -z-10"><h1 className="hidden md:flex justify-center w-full text-theme-text-accent gap-1">
            {title}
        </h1>
            
            {/*Mobile*/}
        <h3 className="flex md:hidden justify-center w-full text-theme-text-accent gap-1 text-lg">
            {title}
            </h3>
            </div>
    )
}