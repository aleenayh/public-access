import { useGame } from "../../../context/GameContext";
import { parseMarkupFromString } from "../../../utils/parseMarkupFromString";
import type { Character } from "../types";

export function Keys({character}: {character: Character}) {
    const {gameState, updateGameState, user: {id}} = useGame();
    const editable = gameState.players.find((player) => player.character?.name === character.name)?.id === id;
    const keysOfChild = [
        "A flashback showing your latchkey kid routine whenever you got home from school.",
        "A flashback showing how you were an outsider among your school peers.",
        "A flashback to the moment when you realized your parents were imperfect.",
        "A flashback to when you felt genuine happiness as a child.", 
        "A flashback to when you experienced childhood trauma.", 
        "A flashback to the moment when you realized childhood wasn’t forever.", 
        "A flashback to when you first discovered TV Odyssey.", 
    ];
    const keysOfDesolation = [
        "<strong>The Sandstone Arch</strong>: Unlock the End of Session question: “Did you receive a Signal from the Other Side?”",
        "<strong>The Fathomless Well</strong>: Your Reason modifier is reduced by 1 and your Sensitivity modifier is increased by 1 (max 3).", 
        "<strong>The Wandering Monolith</strong>: You can now seek out the Big Man. How do you make contact with him? The Big Man can be consulted like any other Side Character. When you do so, roll with Sensitivity. On a 7-9, you gain 1 Clue; he will reveal it in a way that reﬂects his current disposition. On a 10+, as above, but you gain 2 Clues. On a miss, you must mark the next box on The Key of Desolation.", 
        "<strong>The Chromatic Desert</strong>: You are stranded in the Chromatic Desert. You can no longer be perceived by other characters and all memory of you is erased—it’s like you never existed. You can continue to conduct investigations, but the Clues you find are only available to the group if you describe how you are manipulating media in the real world in order to reveal the Clue to the other Latchkeys.",
        "<strong>The Pure-White Signal</strong>: You lose contact with this world altogether. Tell the Keeper to play a white Odyssey tape and then retire this character.",
    ];

    const markKey = (type: "child" | "desolation", index: number, marked: boolean) => {
        const keysOfTheChild = type === "child" ? character.keysOfTheChild.map((key, i) => i === index ? marked : key) : character.keysOfTheChild;
        const keysOfDesolation = type === "desolation" ? character.keyOfDesolation.map((key, i) => i === index ? marked : key) : character.keyOfDesolation;
        updateGameState({
            ...gameState,
            players: gameState.players.map((player) => player.character && player.id === id ? { ...player, character: { ...player.character, keysOfTheChild, keysOfDesolation}} : player),
        });
    }
    return (
        <div className="flex gap-2">
        <div className="flex-1 border border-theme-border rounded-md flex flex-col px-2"><p>Key of the Child</p>
        <p className="text-xs text-theme-text-muted/80 text-left italic">When you turn this Key, mark and narrate any you wish.</p>
        {keysOfChild.map((text, index) => {
            const isMarked = character.keysOfTheChild[index];
            return (
                <div key={`keyChild-${index}`} className="flex gap-1 text-xs text-left items-baseline my-1">
                    <input type="checkbox" className="relative top-1" checked={isMarked} onChange={() => {
                        markKey("child", index, !isMarked);
                    }} disabled={!editable}/>
                    <p>{parseMarkupFromString(text)}</p>
                </div>
            )
        })}
</div>
        <div className="flex-1 border border-theme-border rounded-md flex flex-col px-2"><p>Key of Desolation</p>
        <p className="text-xs text-theme-text-muted/80 text-left italic">When you turn this Key, mark the first empty box.</p>
        {keysOfDesolation.map((text, index) => {
            const isMarked = character.keyOfDesolation[index];
            return (
                <div key={`keyDesolation-${index}`} className="flex gap-1 text-xs text-left items-baseline my-1">
                    <input type="checkbox" className="relative top-1" checked={isMarked} onChange={() => {
                        markKey("desolation", index, !isMarked);
                    }} disabled={!editable}/>
                    <p>{parseMarkupFromString(text)}</p>

                </div>
            )
        })}
         </div>
        </div>
    )
}