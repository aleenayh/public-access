
import { CharacterPane } from "./CharacterPane";
import { AnimatedHeader } from "./shared/AnimatedHeader";
import { SettingsPopout } from "./shared/SettingsPopout";
import { ContentPane } from "./ContentPane";

	export function Game() {
	return (
		<div className="isolate h-full w-full flex flex-col">
			<SettingsPopout/>
			<AnimatedHeader text="Public Access"/>

<div className="flex gap-4 flex-1 px-4">
			<ContentPane />
			<CharacterPane />
			</div>
		</div>
	);
}