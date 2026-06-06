import { useState } from "react";
import { usePreferences } from "../../context/PreferencesContext";

export function SettingsPopout() {
	const {theme, saveTheme} = usePreferences();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className={`flex flex-row-reverse absolute top-0 transition-all duration-300 ease-in-out ${isOpen ? "left-0" : "-left-[250px]"}`}>
			<button type="button" className="text-center text-theme-text-muted pointer-cursor text-xl bg-theme-bg-secondary rounded-tr-lg rounded-br-lg px-2 h-8" onClick={() => setIsOpen(!isOpen)}>
			⚙ <span aria-hidden="false" className="sr-only">Settings Menu</span>
			</button>
			<div className={`bg-theme-bg-secondary rounded-br-lg p-3 w-[250px] text-sm flex flex-col px-6 text-left`}>
				<h4>Change Visual Theme</h4>
				<div><input type="radio" name="theme" value="eighties" checked={theme === "eighties"} onChange={() => saveTheme("eighties")} />
				<label htmlFor="eighties" className={`${theme === "eighties" ? "text-theme-text-accent font-bold" : "text-theme-text-muted"}`}>Eighties</label></div>
				<div><input type="radio" name="theme" value="light" checked={theme === "light"} onChange={() => saveTheme("light")} />
				<label htmlFor="light" className={`${theme === "light" ? "text-theme-text-accent font-bold" : "text-theme-text-muted"}`}>Light</label></div>
				<div><input type="radio" name="theme" value="analog" checked={theme === "analog"} onChange={() => saveTheme("analog")} />
				<label htmlFor="analog" className={`${theme === "analog" ? "text-theme-text-accent font-bold" : "text-theme-text-muted"}`}>Analog</label></div>
				<div><input type="radio" name="theme" value="forum" checked={theme === "forum"} onChange={() => saveTheme("forum")} />
				<label htmlFor="forum" className={`${theme === "forum" ? "text-theme-text-accent font-bold" : "text-theme-text-muted"}`}>Forum</label></div>
				<div><input type="radio" name="theme" value="dark" checked={theme === "dark"} onChange={() => saveTheme("dark")} />
				<label htmlFor="dark" className={`${theme === "dark" ? "text-theme-text-accent font-bold" : "text-theme-text-muted"}`}>Dark</label></div>


			</div>
		</div>
	);
}