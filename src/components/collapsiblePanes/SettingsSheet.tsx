import { toast } from "react-hot-toast";
import { useGame } from "../../context/GameContext";
import { downloadGameStateJSON } from "../../utils/download";
import { Copy } from "../svgs/Copy";
import { useState } from "react";
import { PlayerRole, type Player } from "../../context/types";
import { Dialog } from "radix-ui"
import { CloseButton } from "../shared/CloseButton";
import { Divider } from "../shared/Divider";

export function SettingsSheet() {
    return (
        <div className="flex flex-col gap-10 justify-between h-full">
            <Credits />
            <Divider/>
            <GameInfo />
            <Divider/>
            <ManagePlayers />
            </div>
    )
}

  function GameInfo() {
	const { gameHash, user, gameState } = useGame();

	const copyToClipboard = () => {
		navigator.clipboard.writeText(gameHash);
		toast.success("Copied to clipboard!");
	};
	const backToLanding = () => {
		localStorage.removeItem("playerRole");
		window.location.href = "/";
	};

	const clickDownload = () => {
		downloadGameStateJSON(gameState, `PublicAccess-game-${gameHash}.json`);
	};

	return (
		<div className="flex flex-col gap-2 pointer-events-auto">
			<div className="flex justify-center items-center gap-2">
				<p>Currently Playing</p>

                <button
                    type="button"
                    className="formButton flex flex-col items-center justify-center"  
					onClick={copyToClipboard}
				>
					<Copy height={24} /> {gameHash}
				</button>

				<p>as {user.name}.</p>
			</div>

			<button
				type="button"
				onClick={backToLanding}
				className="text-theme-text-accent underline hover:text-theme-text-muted transition-colors"
			>
				Join a different game
			</button>
			<p className="text-theme-text-muted text-sm inline text-left">
				Games are considered active if they have been used during the last 3
				months. Inactive games are periodically removed. If you want to take a
				longer break,{" "}
				<button
					type="button"
					onClick={clickDownload}
					className="text-theme-text-accent underline hover:text-theme-text-muted transition-colors"
				>
					download your game file
				</button>{" "}
				to use when re-starting your game.
			</p>
		</div>
	);
}
  
  
  function Credits() {
    return (
      <div className="flex flex-col gap-2 justify-start items-start text-left w-full text-sm pb-12 md:pb-4">
        <h3 className="text-lg font-bold text-theme-text-accent text-center w-full">About this Site</h3>
        <p>
          Site designed and maintained by <a href="https://github.com/aleenayh">Aleena Yunuba.</a> If you encounter
          accessibility issues, please <a href="mailto:aleenayunuba@gmail.com">let me know</a>.
        </p>
  
        <p>
          <span translate="no">Public Access</span>{" "}is a creation of Jason Cordova distributed by{" "}
          <a href="https://www.gauntlet-rpg.com/">The Gauntlet</a>. Please{" "}
          <a href="https://discord.com/invite/ScVrPDgfeg">join the Gauntlet on Discord</a> for the latest game updates.
        </p>
      </div>
    )
  }

function ManagePlayers() {
	const { gameState: {players}, updateGameState, user: {role, id} } = useGame();

    const [retireModalOpen, setRetireModalOpen] = useState(false);
    const [removePlayerModalOpen, setRemovePlayerModalOpen] = useState(false);
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

    const triggerModalFor = (playerId: string, modalType: 'retire' | 'remove') => {
        setSelectedPlayerId(playerId);
        if (modalType === 'retire') {
            setRetireModalOpen(true);
        } else {
            setRemovePlayerModalOpen(true);
        }
    }

	const removeCharacter = () => {
        const playerId = selectedPlayerId;
        if (!playerId) return;
        updateGameState({
            players: players.map((player)=> {
                if (player.id === playerId) {
                    return { ...player, character: null }
                }
                return player
            })
        })
        toast.success(`${players.find((player)=> player.id === playerId)?.name}'s character has been retired.`);
        setRetireModalOpen(false);
        setSelectedPlayerId(null);
    }

    const removePlayer = () => {
        const playerId = selectedPlayerId;
        if (!playerId) return;
        updateGameState({
            players: players.filter((player)=> player.id !== playerId)
        })
        toast.success(`Player has been removed from the game.`);
        setRemovePlayerModalOpen(false);
        setSelectedPlayerId(null);
    }

    if (role !== PlayerRole.KEEPER) return null;

	return (
		<div className="flex flex-col gap-2 text-theme-text-primary">
			<div className="flex flex-col gap-2">
            <p className="italic text-xs text-left text-theme-text-muted">Retiring a character here is the same as the player doing it themselves. The player will be prompted to create a new character the next time they join the game. Removing a player will prompt them to rejoin the game if they return, and make a fresh character. This Keeper tool is intended for players who unexpectedly leave the campaign. Removing characters is <strong>PERMANENT.</strong></p>

            <div className="flex flex-col justify-center items-start gap-2 ">
                {players.filter((player)=> player.id !== id).map((player, i)=> {
                    return (<div key={player.id} className=                    {`px-6 w-full flex text-sm gap-2 justify-evenly items-center ${i % 2 === 0 ? 'bg-theme-bg-secondary' : ''}`}>
                        <div className="flex flex-1 gap-4 items-center"><p>{player.name}</p> <button type="button" className="text-theme-text-primary bg-theme-bg-primary hover:bg-theme-bg-accent border border-theme-border-accent rounded-lg p-1" onClick={()=> triggerModalFor(player.id, 'remove')}>Remove                     {player.name} from game</button></div>
                        <div className="flex flex-1 gap-4 items-center"><p>{player.character ? `playing as ${player.character.name}` : player.role === PlayerRole.KEEPER ? 'playing as Keeper' : 'with no active character'}</p> {player.character ? <button type="button" className="text-theme-text-primary bg-theme-bg-primary hover:bg-theme-bg-accent border border-theme-border-accent rounded-lg p-1" onClick={()=> triggerModalFor(player.id, 'retire')}>Retire character</button> : null}</div>
                    </div>)
                })}
            </div>
            </div>
            <Dialog.Root open={retireModalOpen} onOpenChange={setRetireModalOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay" />
                    <Dialog.Content className="DialogContent">
                        <Dialog.Close asChild>
                            <CloseButton />
                        </Dialog.Close>
                        <Dialog.Title className="DialogTitle">Retire Character</Dialog.Title>
                        <Dialog.Description className="DialogDescription">Are you sure you wish to retire this character? This action is PERMANENT.</Dialog.Description>
                        <div className="flex flex-col gap-2 w-full justify-center items-center">
                       <div className="flex justify-center items-center gap-2">                {prettyCharacterName(players, selectedPlayerId)}</div>
                       <button type="button" className="text-theme-text-primary bg-theme-bg-primary hover:bg-theme-bg-accent border border-theme-border-accent rounded-lg p-1" onClick={removeCharacter}>Yes, retire this character</button></div>

                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
            <Dialog.Root open={removePlayerModalOpen} onOpenChange={setRemovePlayerModalOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay" />
                    <Dialog.Content className="DialogContent">
                        <Dialog.Close asChild>
                            <CloseButton />
                        </Dialog.Close>
                        <Dialog.Title className="DialogTitle">Remove Player</Dialog.Title>
                        <Dialog.Description className="DialogDescription">Are you sure you wish to remove this player? This action is PERMANENT. If they have an associated character, it will be retired immediately.</Dialog.Description>
                        <div className="flex flex-col gap-2 w-full justify-center items-center">

                        <p className="text-small text-left text-theme-text-muted">This action does not prevent the player from rejoining the game if they return. They will be prompted to join the game and create a new character.</p>
                       
                       <div className="flex justify-center items-center gap-2">Removing: {players.find((player)=> player.id === selectedPlayerId)?.name}</div>
                       <button type="button" className="text-theme-text-primary bg-theme-bg-primary hover:bg-theme-bg-accent border border-theme-border-accent rounded-lg p-1" onClick={removePlayer}>Yes, remove this player</button></div>

                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
		</div>
	);
}


function prettyCharacterName(players: Player[], playerId: string | null):string {
    if (!playerId) return "this character";
    const player = players.find((player)=> player.id === playerId);
    if (!player) return "this character";

    const character = player.character;
    if (!character) return `${player.name}'s character`;

    return `${character.name}`
}