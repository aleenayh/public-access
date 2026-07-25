
import { CharacterPane } from "./characters/CharacterPane";
import { AnimatedHeader } from "./shared/AnimatedHeader";
import { SettingsPopout } from "./shared/SettingsPopout";
import { ContentPane } from "./ContentPane";

	export function Game() {
	return (
		<div className="isolate h-full w-full flex flex-col justify-stretch items-stretch">
			<SettingsPopout/>
			<AnimatedHeader text="Public Access" />
			<div className="GameContainer">
			<ContentPane />
			<div className="hidden md:block flex-1"><CharacterPane /></div>
			</div>
		</div>
	);
}