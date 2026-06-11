import { StyledPane } from "./shared/StyledPane";
import { FooterNav } from "./FooterNav";
import { MysteryPane } from "./MysteryPane";

    export function ContentPane() {
	return (
			<StyledPane variant="vertical">
				<MysteryPane />
                <FooterNav/>
            </StyledPane>
	);
}