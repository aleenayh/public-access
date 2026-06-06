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
	const activePlayer = activeCharacterRaw ? gameState.players.find((player) => player.character?.name === activeCharacterRaw) : null;
	const activeCharacter = activePlayer?.character;
	return (
		<StyledPane variant="vertical">
			<CharacterCreateModal/>
			<HeaderNav activeCharacter={activeCharacterRaw} setActiveCharacter={setActiveCharacter}/>
			<Seperator/>

			<div className="flex flex-col gap-2 flex-1 w-full overflow-y-auto pb-20">
			<h3 className="text-theme-text-primary sticky top-0 bg-theme-bg-primary rounded-bl-md rounded-br-md w-fit mx-auto px-2 text-xl">{activeCharacter?.name}</h3>
			<p className="text-xs text-theme-text-muted/80 text-center"><span className="italic">{activeCharacter?.pronouns}</span> | Played by {activePlayer?.name}</p>


			<div className="h-24 w-full border border-theme-border rounded-md"> 			
				<p>Conditions</p>
			</div>

			<div className="h-24 w-full border border-theme-border rounded-md"> 	
			<p>Ability Boxes</p>
			</div>
			<div className="flex gap-2 h-36">
			<div className="flex-1 border border-theme-border rounded-md"><p>Your Corner of the House</p></div>
			<div className="flex-1 border border-theme-border rounded-md"><p>Latchkey Moves</p></div>
			</div>

			<p className="h-24">Questions & XP</p>

			<div className="flex gap-2 h-36">
			<div className="flex-1 border border-theme-border rounded-md"><p>Key of the Child</p>
			A flashback showing your latchkey kid routine whenever you got home from school.
A flashback showing how you were an outsider among your school peers. 
A flashback to the moment when you realized your parents were imperfect.
A flashback to when you felt genuine happiness as a child. 
A flashback to when you experienced childhood trauma. 
A flashback to the moment when you realized childhood wasn’t forever. 
A flashback to when you first discovered TV Odyssey. 
</div>
			<div className="flex-1 border border-theme-border rounded-md"><p>Key of Desolation</p>
			The Sandstone Arch. Unlock the End of Session question: “Did you receive a Signal from the Other Side?”
The Fathomless Well. Your Reason modifier is reduced by 1 and your Sensitivity modifier is increased by 1 (max 3). 
The Wandering Monolith. You can now seek out the Big Man. How do you make contact with him? The Big Man can be consulted like any other Side Character. When you do so, roll with Sensitivity. On a 7-9, you gain 1 Clue; he will reveal it in a way that reﬂects his current disposition. On a 10+, as above, but you gain 2 Clues. On a miss, you must mark the next box on The Key of Desolation. 
The Chromatic Desert. You are stranded in the Chromatic Desert. You can no longer be perceived by other characters and all memory of you is erased—it’s like you never existed. You can continue to conduct investigations, but the Clues you find are only available to the group if you describe how you are manipulating media in the real world in order to reveal the Clue to the other Latchkeys.
The Pure-White Signal. You lose contact with this world altogether. Tell the Keeper to play a white Odyssey tape and then retire this character. </div>
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