import { StyledPane } from "../shared/StyledPane";
import { CharacterCreateModal } from "./CharacterCreateModal";
import { HeaderNav } from "./HeaderNav";
import { useGame } from "../../context/GameContext";
import { useState } from "react";
import { PlayerRole } from "../../context/types";

export function CharacterPane() {
	const {gameState, user: {id, role}} = useGame();
	const myChar = gameState.players.find((player) => player.id === id)?.character;
	const [activeCharacterRaw, setActiveCharacter] = useState<string | null>(role === PlayerRole.KEEPER ? "overview" : myChar?.name || null);
	const activeCharacter = activeCharacterRaw ? gameState.players.find((player) => player.character?.name === activeCharacterRaw)?.character : null;
	return (
		<StyledPane variant="vertical">
			<CharacterCreateModal/>
			<HeaderNav activeCharacter={activeCharacterRaw} setActiveCharacter={setActiveCharacter}/>
			<Seperator/>

			<div className="flex flex-col gap-2 flex-1 w-full overflow-y-auto">
			<h3 className="text-theme-text-primary ">{activeCharacter?.name}</h3>
			<p className="text-xs text-theme-text-muted/80 text-center italic">{activeCharacter?.pronouns}</p>


			<div className="h-24 w-full border border-theme-border rounded-md"> 			
				<p>Conditions</p>
			</div>

			<div className="h-24 w-full border border-theme-border rounded-md"> 	
			<p>Ability Boxes</p>
			</div>
			<div className="flex gap-2 h-36">
			<div className="flex-1 border border-theme-border rounded-md"><p>Stuff</p></div>
			<div className="flex-1 border border-theme-border rounded-md"><p>Moves</p></div>
			</div>

			<p className="h-24">Questions & XP</p>

			<div className="flex gap-2 h-36">
			<div className="flex-1 border border-theme-border rounded-md"><p>Key of the Child</p></div>
			<div className="flex-1 border border-theme-border rounded-md"><p>Key of Desolation</p></div>
			</div>

			<p className="text-left"><strong className="text-theme-text-accent">Look:</strong> {activeCharacter?.look}</p>
			<p className="text-left"><strong className="text-theme-text-accent">Takes You Back:</strong> {activeCharacter?.takesYouBack}</p>
			</div>
		</StyledPane>
	);
}

function Seperator() {
	return <div className="w-full h-px my-2 bg-theme-border-accent"/>
}