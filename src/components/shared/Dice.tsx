import { AnimatePresence, motion } from "framer-motion";
import { Dialog, Tooltip } from "radix-ui";
import { useEffect, useId, useState } from "react";
import { useGame } from "../../context/GameContext";
import { usePreferences } from "../../context/PreferencesContext";
import { Dice } from "../svgs/Dice";
import type { AbilityKey } from "../characters/types";
import { CloseButton } from "./CloseButton";

export function DiceIndicator({ characterId }: { characterId: string }) {
	const {
		gameState,
		user: { id },
	} = useGame();
	const [isOpen, setIsOpen] = useState(false);
    const [rolling, setRolling] = useState(false);
    const player = gameState.players.find((player)=> player.character?.id === characterId)
	const lastRoll = player?.lastRoll;
	//don't force tooltip for self, you're already rolling in the modal
    const isSelf = player?.id === id;

	useEffect(() => {
		if (!lastRoll || isSelf) return;
		//impossible roll, we use it to indicate in process of rolling
		if (lastRoll.roll === -999) {
			setTimeout(() => {
                setRolling(true);
                setIsOpen(true);
			}, 100);
		} else if (lastRoll.roll !== -999) {
			setTimeout(() => {
                setRolling(false);
            }, 100);
			setTimeout(() => {
				setIsOpen(false);
			}, 4000);
		}
    }, [lastRoll, isSelf]);
    
    if (!player) return null

	const openForThreeSeconds = () => {
		setIsOpen(true);
		setTimeout(() => {
			setIsOpen(false);
		}, 3000);
	};

	return (
		<Tooltip.Root open={isOpen} onOpenChange={setIsOpen}>
			<div className="absolute top-1 left-4 text-theme-border-accent w-10 h-10">
				<Tooltip.Trigger asChild>
					<button type="button" onClick={openForThreeSeconds}>
						<Dice className="w-10 h-10" />
					</button>
				</Tooltip.Trigger>
			</div>
			<Tooltip.Content side={"right"}>
					{!rolling ? (
						<div className="flex flex-col gap-0 leading-none">
							<div className="text-xs text-theme-text-muted">Last roll:</div>{" "}
							<div className="text-lg font-bold">
								<strong>{lastRoll?.roll}</strong>
							</div>
							<div className="lowercase text-xs text-theme-text-muted">
								({lastRoll?.type ?? "N/A"})
							</div>
						</div>
					) : (
						<div className="diceRolling">
							<Dice className="w-10 h-10" />
						</div>
					)}
			</Tooltip.Content>
		</Tooltip.Root>
	);
}

type AbilityBoxProps = {
    ability: AbilityKey
    value: number,
    editable: boolean
  }
  
type Die = {
    id: string
    value: number
    isRolling: boolean
    exclude: boolean
}
  
export function AbilityBox({ ability, value, editable }: AbilityBoxProps) {
    const [rollType, setRollType] = useState<"regular" | "advantage" | "disadvantage">("regular")
    const id = useId()
    const { prefersImmediateDice, prefersReducedMotion } = usePreferences();
    const resetDice = (number: number) => {
      return Array.from({ length: number }, (_, index) => ({
        id: `${id}-${index}`,
        value: 0,
        isRolling: false,
        exclude: false,
      }))
    }
    const [dice, setDice] = useState<Die[]>(resetDice(2))
    const [total, setTotal] = useState<number | null>(null)
    const [bounceValue, setBounceValue] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const {
      gameState,
      updateGameState,
      user: { id: playerId },
    } = useGame()

    if (!editable) {
        return <div className="flex flex-col gap-1 rounded-lg border border-theme-border-accent p-1 bg-theme-bg-secondary justify-center items-center min-w-[10%]">
        <h4 className="text-theme-text-muted truncate max-w-full whitespace-nowrap overflow-hidden text-ellipsis">
          <abbr title={ability}>{ability.slice(0, 4)}</abbr>
        </h4>
        <div className="text-center text-lg font-bold bg-transparent">{value}</div>
      </div>
    }

    const calcTotal = (diceToCalc: Die[]) => {
      setTimeout(() => {
        const result = diceToCalc.filter((die) => !die.exclude).reduce((acc, die) => acc + die.value, 0)
        const thisTotal = result + value
        setTotal(thisTotal)
        updateGameState({
          players: gameState.players.map((player) =>
            player.id === playerId
              ? {
                  ...player,
                  lastRoll: {
                    roll: Number(thisTotal),
                    type: ability,
                    timestamp: new Date(),
                  },
                }
              : player,
          ),
        })
      }, prefersImmediateDice ? 0 : 1500)
    }
  
    const handleRoll = () => {
      //update timestamp immediately allows other players to see that you're "rolling"
      //an impossible roll to indicate in process of rolling
      updateGameState({
        players: gameState.players.map((player) =>
          player.id === playerId
            ? {
                ...player,
                lastRoll: { roll: -999, type: ability, timestamp: new Date() },
              }
            : player,
        ),
      })
      setTotal(null)
      setBounceValue(false)
      const numDice = rollType === "regular" ? 2 : 3
      const initialDice = resetDice(numDice)
      setDice(initialDice.map((die) => ({ ...die, isRolling: true })))
  
      setTimeout(() => {
        // Generate rolled values first so we can use them for both state and calculation
        const rolledDice = initialDice.map((die) => ({
          ...die,
          isRolling: false,
          value: rollDie(),
        }))
  
        setDice(rolledDice)
  
        if (rollType !== "regular") {
          setTimeout(() => {
            const idToExclude =
              rollType === "advantage"
                ? rolledDice.find((die) => die.value === Math.min(...rolledDice.map((die) => die.value)))?.id
                : rolledDice.find((die) => die.value === Math.max(...rolledDice.map((die) => die.value)))?.id
  
            const finalDice = rolledDice.map((die) => ({
              ...die,
              exclude: die.id === idToExclude,
            }))
  
            setDice(finalDice)
            if (!prefersImmediateDice && !prefersReducedMotion)           {
              setBounceValue(true)
            }
            calcTotal(finalDice)
          }, prefersImmediateDice ? 0 : 1200)
        } else {
          if (!prefersImmediateDice && !prefersReducedMotion)           {
            setBounceValue(true)
          }
          calcTotal(rolledDice)
        }
      }, prefersImmediateDice ? 0 : 2500)
    }
  
    const handleOpenChange = (open: boolean) => {
      setIsOpen(open)
      if (!open) {
        setBounceValue(false)
        setTotal(null)
        setDice(resetDice(2))
      }
    }
  
    return (
      <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
        <Dialog.Trigger asChild disabled={!editable}>
          <div className="flex flex-col gap-1 rounded-lg border border-theme-border-accent p-1 bg-theme-bg-secondary justify-center items-center min-w-[10%] cursor-pointer">
            <h4 className="text-theme-text-muted truncate max-w-full whitespace-nowrap overflow-hidden text-ellipsis">
              <abbr title={ability}>{ability.slice(0, 4)}</abbr>
            </h4>
            <div className="text-center text-lg font-bold bg-transparent">{value}</div>
          </div>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <Dialog.Content className="DialogContent">
            <Dialog.Close asChild>
              <CloseButton />
            </Dialog.Close>
            <Dialog.Title className="DialogTitle">Roll {ability.charAt(0).toUpperCase() + ability.slice(1)}</Dialog.Title>
            <Dialog.Description className="hidden">Roll with {ability}</Dialog.Description>
            <fieldset className="flex flex-col md:flex-row gap-2 justify-center items-center">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="regular"
                  id={`${id}-regular`}
                  checked={rollType === "regular"}
                  onChange={() => setRollType("regular")}
                />
                <label htmlFor={`${id}-regular`}>Regular Roll</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="advantage"
                  id={`${id}-advantage`}
                  checked={rollType === "advantage"}
                  onChange={() => setRollType("advantage")}
                />
                <label htmlFor={`${id}-advantage`}>Advantage</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="disadvantage"
                  id={`${id}-disadvantage`}
                  checked={rollType === "disadvantage"}
                  onChange={() => setRollType("disadvantage")}
                />
                <label htmlFor={`${id}-disadvantage`}>Disadvantage</label>
              </div>
            </fieldset>
            <div className="w-full flex justify-center items-center">
              {" "}
              <button
                type="button"
                onClick={handleRoll}
                className="mx-auto bg-theme-bg-primary border border-theme-border text-theme-text-primary rounded-md p-2 hover:bg-theme-bg-accent hover:text-theme-text-accent"
              >
                Roll
              </button>
            </div>
            <div className="w-full h-32 flex gap-4 justify-center items-center">
              {Array.from({ length: 3 }).map((_, index) => (
                <DieComponent
                  key={`${id}-${
                    // biome-ignore lint/suspicious/noArrayIndexKey: visual only
                    index
                  }`}
                  dice={dice}
                  id={id}
                  index={index}
                />
              ))}
            </div>
            <div className="flex flex-col justify-center items-center text-center text-lg font-bold">
              <span className={`${bounceValue ? "bounce" : ""} text-theme-text-accent`}>
                {value >= 0 ? `+${value}` : value}
              </span>
              Total: {total !== null ? total : ""}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    )
  }

// export function AnswerQuestionDiceRollModal({
// 	mystery,
// 	question,
// }: {
// 	mystery: Mystery;
// 	question: Question;
// }) {
// 	const id = useId();
// 	const { prefersImmediateDice, prefersReducedMotion } = usePreferences();
// 	const resetDice = (number: number) => {
// 		return Array.from({ length: number }, (_, index) => ({
// 			id: `${id}-${index}`,
// 			value: 0,
// 			isRolling: false,
// 			exclude: false,
// 		}));
// 	};
// 	const [dice, setDice] = useState<Die[]>(resetDice(2));
// 	const [total, setTotal] = useState<number | null>(null);
// 	const [bounceValue, setBounceValue] = useState(false);
// 	const [isOpen, setIsOpen] = useState(false);

// 	const { gameState, updateGameState } = useGame();

// 	const mysteryState = gameState.mysteries.find(
// 		(m) => m.title === mystery.title,
// 	);
// 	const questionState = mysteryState?.questions?.find(
// 		(q) => q.text === question.text,
// 	);
// 	const cluesAssigned =
// 		mysteryState?.clues?.filter((clue) => clue.explained && !clue.removed)
// 			.length ?? 0;

// 	const complexity = questionState?.complexity ?? 2;
// 	const [modifier, setModifier] = useState(cluesAssigned - complexity);
// 	useEffect(() => {
// 		setModifier(cluesAssigned - complexity);
// 	}, [cluesAssigned, complexity]);
// 	if (!questionState || !mysteryState) {
// 		return null;
// 	}

// 	const calcTotal = (diceToCalc: Die[]) => {
// 		setTimeout(() => {
// 			const result = diceToCalc
// 				.filter((die) => !die.exclude)
// 				.reduce((acc, die) => acc + die.value, 0);
// 			const thisTotal = result + modifier;
// 			setTotal(thisTotal);
// 			updateGameState({
// 				mysteries: gameState.mysteries.map((m) =>
// 					m.title === mystery.title
// 						? {
// 								...m,
// 								questions: m.questions?.map((q) =>
// 									q.text === question.text ? { ...q, result: thisTotal } : q,
// 								),
// 							}
// 						: m,
// 				),
// 			});
// 		}, prefersImmediateDice ? 0 : 1500);
// 	};

// 	const handleRoll = () => {
// 		//update timestamp immediately allows other players to see that you're "rolling"
// 		//zero is an impossible roll, we use it to indicate in process of rolling

// 		setTotal(null);
// 		setBounceValue(false);
// 		const initialDice = resetDice(2);
// 		setDice(initialDice.map((die) => ({ ...die, isRolling: true })));

// 		setTimeout(() => {
// 			// Generate rolled values first so we can use them for both state and calculation
// 			const rolledDice = initialDice.map((die) => ({
// 				...die,
// 				isRolling: false,
// 				value: rollDie(),
// 			}));

// 			setDice(rolledDice);
// 			if (!prefersImmediateDice && !prefersReducedMotion) {
// 				setBounceValue(true);
// 			}
// 			calcTotal(rolledDice);
// 		}, prefersImmediateDice ? 0 : 2500);
// 	};

// 	const handleOpenChange = (open: boolean) => {
// 		setIsOpen(open);
// 		if (!open) {
// 			setBounceValue(false);
// 			setTotal(null);
// 			setDice(resetDice(2));
// 		}
// 	};

// 	return (
// 		<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
// 			<Dialog.Trigger asChild>
// 				<div className="-m-1 text-theme-text-muted hover:text-theme-text-accent flex items-center justify-center">
// 					<DiceIcon className="w-8 h-8 transform rotate-45" />
// 				</div>
// 			</Dialog.Trigger>
// 			<Dialog.Portal>
// 				<Dialog.Overlay className="DialogOverlay" />
// 				<Dialog.Content className="DialogContent">
// 					<Dialog.Close asChild>
// 						<button
// 							type="button"
// 							onClick={() => handleOpenChange(false)}
// 							className="absolute top-2 right-2 aspect-square w-8 h-8 bg-theme-bg-accent text-theme-text-primary rounded-full flex justify-center items-center"
// 						>
// 							X
// 						</button>
// 					</Dialog.Close>
// 					<Dialog.Title className="DialogTitle">Answer Question</Dialog.Title>
// 					<Dialog.Description>{question.text}</Dialog.Description>

// 					<div className="pt-4 flex flex-col gap-2">
// 						<p className="text-theme-text-muted italic">
// 							A Complexity {complexity} question with {cluesAssigned} clues
// 							used. You can manually adjust the modifier before rolling if
// 							necessary.
// 						</p>
// 						<div className="my-4 flex gap-1 items-center justify-center">
// 							<button
// 								type="button"
// 								className="text-theme-text-accent border border-theme-border bg-theme-bg-primary hover:bg-theme-bg-accent flex items-center justify-center aspect-square rounded-full px-2"
// 								onClick={() => setModifier(modifier - 1)}
// 							>
// 								-
// 							</button>
// 							<span className="text-theme-text-accent border border-theme-border bg-theme-bg-primary text-center text-lg font-bold rounded-md p-2">
// 								{modifier}
// 							</span>
// 							<button
// 								type="button"
// 								className="text-theme-text-accent border border-theme-border bg-theme-bg-primary hover:bg-theme-bg-accent flex items-center justify-center aspect-square rounded-full px-2"
// 								onClick={() => setModifier(modifier + 1)}
// 							>
// 								+
// 							</button>
// 						</div>
// 					</div>

// 					<div className="w-full flex justify-center items-center">
// 						{" "}
// 						<button
// 							type="button"
// 							onClick={handleRoll}
// 							className="mx-auto bg-theme-bg-accent text-theme-text-primary rounded-md p-2 hover:bg-theme-bg-accent/80 hover:text-theme-text-primary/80"
// 						>
// 							Roll
// 						</button>
// 					</div>
// 					<div className="w-full h-32 flex gap-4 justify-center items-center">
// 						{Array.from({ length: 3 }).map((_, index) => (
// 							<DieComponent
// 								key={`${id}-${
// 									// biome-ignore lint/suspicious/noArrayIndexKey: visual only
// 									index
// 								}`}
// 								dice={dice}
// 								id={id}
// 								index={index}
// 							/>
// 						))}
// 					</div>
// 					<div className="flex flex-col justify-center items-center text-center text-lg font-bold">
// 						<span
// 							className={`${bounceValue ? "bounce" : ""} text-theme-text-accent`}
// 						>
// 							{modifier >= 0 ? `+${modifier}` : modifier}
// 						</span>
// 						Total: {total !== null ? total : ""}
// 					</div>
// 				</Dialog.Content>
// 			</Dialog.Portal>
// 		</Dialog.Root>
// 	);
// }

function DieComponent({
	dice,
	id,
	index,
}: {
	dice: Die[];
	id: string;
	index: number;
}) {
	const { prefersReducedMotion } = usePreferences();
	const die = dice.find((die) => die.id === `${id}-${index}`);
	if (!die) {
		return null;
	}
	return (
		<div
			key={die.id}
			className={`diceBase ${die.exclude ? "diceExcluded" : ""} ${die.isRolling && !prefersReducedMotion ? "diceRolling" : ""}`}
		>
			<AnimatePresence>
				{die.isRolling && !prefersReducedMotion ? (
					<div className="diceRollingIcon" />
				) : (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.5 }}
						className="text-xl font-bold"
					>
						{die.isRolling ? "?" : die.value}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

function rollDie() {
	return Math.floor(Math.random() * 6) + 1;
}