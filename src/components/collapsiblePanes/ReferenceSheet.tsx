import { useState } from "react"

export function ReferenceSheet() {
    const [view, setView] = useState<"moves" | "phases">("moves")
    return (
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-clip isolate">
            <div className="w-full flex flex-col md:grid md:grid-cols-2 gap-2 text-xs">
              <button type="button" className={`gridButton ${view === "moves" ? "active" : ""}`} onClick={() => setView("moves")}>
                <h3 className="text-sm">Moves</h3>
              </button>
              <button type="button" className={`gridButton ${view === "phases" ? "active" : ""}`} onClick={() => setView("phases")}>
                <h3 className="text-sm">Phases</h3>
              </button>
            </div>
            <div className="flex flex-col justify-stretch items-start text-left">
              {view === "moves" && <MovesSection />}
              {view === "phases" && <PhaseSection />}
            </div>
        </div>
    )
}

function MovesSection() {
    const [view, setView] = useState<"day" | "night" | "meddling" | "nostalgic" | "answer-question">("day")
    return (
      <div className="mt-2 rounded-md border border-theme-border-accent p-4 w-full">
        <div className="w-full flex flex-col md:grid md:grid-cols-5 gap-2 text-xs">
          <button type="button" className={`gridButton ${view === "day" ? "active" : ""}`} onClick={() => setView("day")}>
            <span className="text-xs font-bold">The Day Move</span>
          </button>
          <button type="button" className={`gridButton ${view === "night" ? "active" : ""}`} onClick={() => setView("night")}>
            <span className="text-xs font-bold">The Night Move</span>
          </button>
          <button type="button" className={`gridButton ${view === "meddling" ? "active" : ""}`} onClick={() => setView("meddling")}>
            <span className="text-xs font-bold">The Meddling Move</span>
          </button>
          <button type="button" className={`gridButton ${view === "nostalgic" ? "active" : ""}`} onClick={() => setView("nostalgic")}>
            <span className="text-xs font-bold">The Nostalgic Move</span>
          </button>
          <button type="button" className={`gridButton ${view === "answer-question" ? "active" : ""}`} onClick={() => setView("answer-question")}>
            <span className="text-xs font-bold">Answer A Question</span>
          </button>
        </div>
  
        <div className="text-left pt-4">
          {view === "day" && (
            <div className="flex flex-col gap-2 text-left leading-relaxed text-sm">
              <h3 className="text-lg font-bold text-theme-text-accent text-center">The Day Move</h3>
              <p>
                When you do something risky or face something you fear, name what you’re afraid will happen if you fail or
                lose your nerve, then roll with an appropriate ability.
              </p>
              <ul>
                <li>
                  <strong>On a 10+,</strong> you do what you intended or you hold steady; describe what it looks like.
                </li>
                <li>
                  <strong>On a 7-9,</strong> the Keeper will tell you how your actions would leave you vulnerable, and you
                  can choose to back down or go through with it. If you go through with it, the Keeper describes what it
                  looks like.
                </li>
                <li>
                  <strong>On a 12+,</strong> you do what you intended or you hold steady, and the Keeper will tell you
                  some extra benefit or advantage you receive. Describe what it looks like.
                </li>
              </ul>
            </div>
          )}
          {view === "night" && (
            <div className="flex flex-col gap-2 text-left leading-relaxed text-sm">
              <h3 className="text-lg font-bold text-theme-text-accent text-center">The Night Move</h3>
              <p>
                When you do something risky or face something you fear, name what you’re afraid will happen if you fail or
                lose your nerve. The Keeper will tell you how it is worse than you fear. You can choose to back down or go
                through with it. If you go through with it, roll with an appropriate ability.{" "}
              </p>
              <ul>
                <li>
                  <strong>On a 10+,</strong> you do what you intended or you hold steady; describe what it looks like.
                </li>
                <li>
                  {" "}
                  <strong> On a 7-9,</strong> you do what you intended or you hold steady, but there is a complication or cost; the Keeper describes what it looks like.
                </li>
                <li>
                  {" "}
                  <strong> On a 12+,</strong> you do what you intended or you hold steady, and the Keeper will tell you
                  some extra benefit or advantage you receive. Describe what it looks like.
                </li>
              </ul>
            </div>
          )}
          {view === "meddling" && (
            <div className="flex flex-col gap-2 text-left leading-relaxed text-sm">
              <h3 className="text-lg font-bold text-theme-text-accent text-center">The Meddling Move</h3>
              <p>
                When you search for a clue, conduct research, or otherwise gather information, describe how you’re doing
                so and roll with an appropriate ability.
              </p>{" "}
              <ul>
                <li>
                  <strong>On a hit,</strong> you find a Clue. The Keeper will tell you what it is.
                </li>
                <li>
                  <strong>On a 7-9,</strong> there’s a complication—either with the Clue itself, or a complication you
                  encounter while searching. The Keeper will tell you what the complication is.
                </li>
                <li>
                  <strong>On a 12+,</strong> you also find an Odyssey Tape.
                </li>
              </ul>
            </div>
          )}
          {view === "nostalgic" && (
            <div className="flex flex-col gap-2 text-left leading-relaxed text-sm">
              <h3 className="text-lg font-bold text-theme-text-accent text-center">The Nostalgic Move</h3>
              <p>When you have an intimate moment with one or more Latchkeys while one of you is waxing nostalgic about something that Takes You Back, you may each clear an appropriate Condition. You also stumble on a Clue relevant to an active mystery. As a group, tell the Keeper what it is. The Clue cannot conclusively answer a Question by itself. You can participate in one Nostalgic Move per phase. 
              </p>
            </div>
          )}
          {view === "answer-question" && (
            <div className="flex flex-col gap-2 text-left leading-relaxed text-sm">
              <h3 className="text-lg font-bold text-theme-text-accent text-center">Answer A Question</h3>
              <p>When the Latchkeys have an open, freewheeling discussion about the answer to a Question once they have gathered a number of Clues equal to at least half the Question’s Complexity—and reach a consensus—roll plus the number of Clues incorporated into the answer or otherwise explained away, minus the question’s Complexity.
              </p>
              <ul>
                <li>
                  {" "}
                  <strong>On a 10+,</strong> the answer is correct and an Opportunity can be pursued.
                </li>
                <li>
                  {" "}
                  <strong>On a 7-9,</strong> as above, but the Keeper will add an unwelcome complication to the answer
                  and/or pursuing the Opportunity will be more dangerous.
                </li>
                <li>
                  {" "}
                  <strong>On a miss,</strong> the answer is incorrect and the Keeper reacts.
                </li>
                <li>
                  {" "}
                  <strong>On a 12+,</strong> the answer to the Question is also an Odyssey Clue.
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    )
  }
  
function PhaseSection() {
    const [view, setView] = useState<"day" | "night" | "dawn" | "dusk">("dawn")
    return (
      <div className="mt-2 rounded-md border border-theme-border-accent p-4 w-full overflow-auto">
        <div className="w-full flex flex-col md:grid md:grid-cols-4 gap-2 text-xs">
          <button type="button" className={`gridButton ${view === "dawn" ? "active" : ""}`} onClick={() => setView("dawn")}>
            Dawn
          </button>
          <button type="button" className={`gridButton ${view === "day" ? "active" : ""}`} onClick={() => setView("day")}>
            Day
          </button>
          <button type="button" className={`gridButton ${view === "dusk" ? "active" : ""}`} onClick={() => setView("dusk")}>
            Dusk
          </button>
          <button type="button" className={`gridButton ${view === "night" ? "active" : ""}`} onClick={() => setView("night")}>
            Night
          </button>
        </div>
        <div className="text-left pt-4">
          {view === "day" && (
            <div className="flex flex-col gap-1 text-left leading-relaxed text-sm">
                        <h3 className="text-lg font-bold text-theme-text-accent text-center">Day</h3>
                        <p className="text-xs italic text-theme-text-muted">Perform the following steps in order:</p>
              <ol>
                <li>The Keeper presents a new mystery if there are less than three active mysteries.</li>
                <li>Regular scenes commence, and continue until the Keeper decides to move to the Dusk Phase.</li>
              </ol>
            </div>
          )}
          {view === "night" && (
            <div className="flex flex-col gap-1 text-left leading-relaxed text-sm">
                        <h3 className="text-lg font-bold text-theme-text-accent text-center">Night</h3>
                        <p className="text-xs italic text-theme-text-muted">Perform the following steps in order:</p>
              <div className="grid grid-cols-2 justify-evenly gap-4">
                <ol>
                  <strong className="text-theme-text-accent">Without an Odyssey Tape:</strong>
                  <li>Regular scenes commence, and continue until the Keeper decides to move to the Dawn Phase. 
                  </li>
                </ol>
                <ol>
                  <strong className="text-theme-text-accent">With an Odyssey Tape:</strong>
                  <li>A player resolves the first Odyssey tape prompt.</li>
                  <li>The Keeper frames up a scene for one or more Latchkeys; the scene plays out briefly, concluding immediately when an action is taken, dice are rolled, or an earlier die roll is resolved.</li>
                  <li>Repeat Step 2 until each Latchkey has been involved in a scene. </li>
                  <li>Repeat Steps 1 through 3 until there are no more Odyssey tape prompts, at which point the Night Phase immediately ends.</li>
                </ol>
              </div>
            </div>
          )}
          {view === "dawn" && (
            <div className="flex flex-col gap-1 text-left leading-relaxed text-sm">
                        <h3 className="text-lg font-bold text-theme-text-accent text-center">Dawn</h3>
                        <p className="text-xs italic text-theme-text-muted">Perform the following steps in order:</p>
  
              <ol>
                <li>Collect Rewards if a Mystery was resolved.</li>
                <li>Answer Dawn questions.</li>
                <li>Mark new elective Dawn questions (or leave either or both the same).</li>
                            <li>Resolve any moves that are resolved during the Dawn Phase.</li>
                            <li>Optional: Resolve any Key prompts that remain unresolved (players can choose to wait until a later time, unless this is the end of the session).</li>
              </ol>
            </div>
          )}
          {view === "dusk" && (
            <div className="flex flex-col gap-1 text-left leading-relaxed text-sm">
                        <h3 className="text-lg font-bold text-theme-text-accent text-center">Dusk</h3>
                        <p className="text-xs italic text-theme-text-muted">Perform the following steps in order:</p>
              <ol>
                <li>Resolve any moves that are resolved during the Dusk Phase.</li>
                <li>
                  The players decide if they are going to watch an Odyssey Tape; if they can't come to a consensus, the Keeper decides.
                            </li>
                            <li>The Latchkeys may attempt to Answer a Question.</li>
                            <li>Each player says what their Latchkey will be doing during the upcoming Night Phase.</li>
                            <li>Optional: Resolve any Key prompts that remain unresolved (players can choose to wait until a later time, unless this is the end of a session).</li>
                            <li>The Keeper introduces the Odyssey tape (if the players chose to watch one) by reading its opening text and assigning the prompts.</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    )
  }