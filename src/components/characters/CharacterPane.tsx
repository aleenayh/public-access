import { StyledPane } from "../shared/StyledPane";
import { HeaderNav } from "./HeaderNav";

export function CharacterPane() {
	return (
		<StyledPane variant="vertical">
			<HeaderNav/>

			Character content goes here ...
		</StyledPane>
	);
}