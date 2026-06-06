import { StyledPane } from "../shared/StyledPane";
import { HeaderNav } from "./HeaderNav";

export function CharacterPane() {
	return (
		<StyledPane variant="vertical">
			<HeaderNav/>

			Character Name

			<p>Conditions</p>

			<p>Ability Boxes</p>

			<p>Moves</p>

			<p>Questions & XP</p>

			<p>Keys</p>

			<p>Look, Pronouns, Takes You Back</p>
		</StyledPane>
	);
}