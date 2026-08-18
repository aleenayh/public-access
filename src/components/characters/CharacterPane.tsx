import { StyledPane } from "../shared/StyledPane";
import { HeaderNav } from "./HeaderNav";
import { useGame } from "../../context/GameContext";
import { useEffect, useState } from "react";
import { PlayerRole } from "../../context/types";
import { CharacterSheet } from "./CharacterSheet";
import { KeeperCharacterOverview } from "./KeeperCharacterOverview";
import { Divider } from "../shared/Divider";

export function CharacterPane() {
	return (
		<StyledPane>
			<CharacterInterior/>
		</StyledPane>
	);
}

export function CharacterInterior() {
	const {gameState, user: {id, role}} = useGame();
	const myChar = gameState.players.find((player) => player.id === id)?.character;
	const [activeCharacterRaw, setActiveCharacter] = useState<string | null>(role === PlayerRole.KEEPER ? "overview" : myChar?.name || null);
	const activeCharacter = gameState.players.find((player) => player.character?.name === activeCharacterRaw)?.character ?? null;

	useEffect(() => {
		if (myChar?.name) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setActiveCharacter(myChar?.name ?? null)
		}
	}, [myChar?.name])
	return <div className="w-full overflow-y-visible h-full">
				<HeaderNav activeCharacter={activeCharacterRaw} setActiveCharacter={setActiveCharacter}/>
			<Divider/>
		<div className="max-h-full min-h-0 overflow-y-auto scrollbar-gutter-stable pb-30">{activeCharacter ? <CharacterSheet character={activeCharacter} /> : <KeeperCharacterOverview />}</div>
	</div>

}