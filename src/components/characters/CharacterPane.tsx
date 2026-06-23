import { StyledPane } from "../shared/StyledPane";
import { CharacterCreateModal } from "./CharacterCreateModal";
import { HeaderNav } from "./HeaderNav";
import { useGame } from "../../context/GameContext";
import { useState } from "react";
import { PlayerRole } from "../../context/types";
import { CharacterSheet } from "./CharacterSheet";
import { KeeperCharacterOverview } from "./KeeperCharacterOverview";
import { Divider } from "../shared/Divider";

export function CharacterPane() {
	const {gameState, user: {id, role}} = useGame();
	const myChar = gameState.players.find((player) => player.id === id)?.character;
	const [activeCharacterRaw, setActiveCharacter] = useState<string | null>(role === PlayerRole.KEEPER ? "overview" : myChar?.name || null);
	const activeCharacter = gameState.players.find((player) => player.character?.name === activeCharacterRaw)?.character ?? null;
	return (
		<StyledPane>
			<CharacterCreateModal/>
			<HeaderNav activeCharacter={activeCharacterRaw} setActiveCharacter={setActiveCharacter}/>
			<Divider/>
            {activeCharacter ? <CharacterSheet character={activeCharacter}/> : <KeeperCharacterOverview/>}
		</StyledPane>
	);
}
