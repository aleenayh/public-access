import { useState } from "react";
import { usePreferences } from "../../context/PreferencesContext";
import { Divider } from "./Divider";

export function SettingsPopout() {
	const {theme, saveTheme, saveMotionPreference, prefersReducedMotion} = usePreferences();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className={`isolate z-2 flex flex-row-reverse absolute top-0 transition-all duration-300 ease-in-out ${isOpen ? "left-0" : "-left-[250px]"}`}>
			<button type="button" className="text-center text-theme-text-muted pointer-cursor text-xl bg-theme-bg-secondary rounded-tr-lg rounded-br-lg px-2 h-8" onClick={() => setIsOpen(!isOpen)}>
			⚙ <span aria-hidden="false" className="sr-only">Settings Menu</span>
			</button>
			<div className={`bg-theme-bg-secondary rounded-br-lg p-3 w-[250px] text-sm flex flex-col px-6 text-left`}>
				<h4>Change Visual Theme</h4>
				<label htmlFor="eighties" className={`${theme === "eighties" ? "text-theme-text-accent font-bold" : "text-theme-text-muted"}`}><input id="eighties" type="radio" name="theme" value="eighties" checked={theme === "eighties"} onChange={() => saveTheme("eighties")} />
				Eighties</label>
				<label htmlFor="light" className={`${theme === "light" ? "text-theme-text-accent font-bold" : "text-theme-text-muted"}`}><input id="light" type="radio" name="theme" value="light" checked={theme === "light"} onChange={() => saveTheme("light")} />
				Light</label>
				<label htmlFor="analog" className={`${theme === "analog" ? "text-theme-text-accent font-bold" : "text-theme-text-muted"}`}><input id="analog" type="radio" name="theme" value="analog" checked={theme === "analog"} onChange={() => saveTheme("analog")} />
				Analog</label>
				<label htmlFor="forum" className={`${theme === "forum" ? "text-theme-text-accent font-bold" : "text-theme-text-muted"}`}><input id="forum" type="radio" name="theme" value="forum" checked={theme === "forum"} onChange={() => saveTheme("forum")} />
				Forum</label>
				<label htmlFor="dark" className={`${theme === "dark" ? "text-theme-text-accent font-bold" : "text-theme-text-muted"}`}><input id="dark" type="radio" name="theme" value="dark" checked={theme === "dark"} onChange={() => saveTheme("dark")} />
					Dark</label>
				<Divider/>
				
					<label htmlFor="reduced-motion" className={`${prefersReducedMotion ? "text-theme-text-accent font-bold" : "text-theme-text-muted"}`}><input id="reduced-motion" type="checkbox" name="reduced-motion" checked={prefersReducedMotion} onChange={() => saveMotionPreference(!prefersReducedMotion)} />
					Reduce motion (disables animations)</label>
			</div>
		</div>
	);
}