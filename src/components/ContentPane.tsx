import { StyledPane } from "./shared/StyledPane";
import { FooterNav } from "./FooterNav";
import { MysteryPane } from "./MysteryPane";

    export function ContentPane() {
	return (
		<StyledPane variant="vertical">
			<h3>Content Pane</h3>
            <MysteryPane/>
			<FooterNav/>
		</StyledPane>
	);
}