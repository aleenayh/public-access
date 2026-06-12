import type { Character } from "./types"

export const nameOptions = [
    "Christopher", "Jason", "Joseph", "Bryan", "Matthew", "Shane", "Zachary", "Nathan", "Juan", "Michael", "Jessica", "Jennifer", "Katie", "Erica", "Meghan", "Crystal", "Amber", "Nicole", "Ashley", "Stephanie"
]
export const surnameOptions = [
    "Lattimore", "McEwen", "Twomey", "Oakes", "Fonteneau", "Serrano", "Torres", "Manlangit", "Schroeder", "Petros", "Mbaye", "Thompson", "Wright", "Patel", "Nakayama", "Fabiani", "Goldberg"
]
export const lookOptions = [
    "TJ Maxximalist", "Cargo shorts and Triforce t-shirt", "None More Goth", "Popped Collar Princeling", "All the Scarves", "I’m Too Emo for My Face", "Livestrong", "Bootcut & Boogie", "Hoodie Under Blazer", "Matching Sneakers", "Jock Jams", "Skinny Jeans & Summer Dreams"
]
export const takesYouBackOptions = [
    "Girl Talk: A Game of Truth or Dare", "The Konami Code", "The Oregon Trail", "BOOK IT!", "Double Dare", "prank phone calls", "Garbage Pail Kids", "M.U.S.C.L.E.", "Rogue", "The Baby-Sitters Club", "My Buddy/Kid Sister", "Jean-Claude Van Damme", "Duck Tales (“oo-oo!”)", "reading sleepovers", "You Can’t Do That On Television", "Huffy 10-speed", "heading home when the streetlights flickered on", "Friday the 13th: The Series", "proton packs", "Artax in the Swamp of Sadness", "Waco", "A very special episode", "Fangoria", "mixtapes", "Starlog", "Lisa Frank", "Yo! MTV Raps", "Tiger Beat", "Easy Bake Oven", "The Day After", "Who Killed Laura Palmer?", "Choose Your Own Adventure", "Fighting Fantasy", "wood paneling", "the L.A. riots", "the Cabbage Patch riots", "the Care Bear stare", "the Walkman", "TV show theme songs", "mall concerts", "horse girls", "Dungeon!", "Headbangers Ball", "Baby Jessica", "Space Shuttle Challenger", "Memphis Group design", "Brookstone", "record stores", "The Joy of Painting", "passing notes in class"
]

export const moves: Record<string, string[]> = {
    "Where's the Beef?": ["You are a little bigger and a little stronger than most. Increase your Vitality by 1 (max 3). You always use Vitality on rolls associated with actions connected to the Big Man. "],
    "Sight Beyond Sight": ["Whether you call it premonitions, understanding omens, or just plain old having a hunch, you are able to glimpse a little into the future. The first time you enter a Location, you can ask the Keeper, “What is about to happen?” They will answer truthfully, though not necessarily completely. If you have marked <strong>The Sandstone Arch</strong>, you can also ask, “Why is it about to happen?” The Keeper will answer truthfully, though not necessarily completely."],
    "This is Your Brain": ["You are a little smarter than most, and when you look into the dark, unfathomable places, your logical edge stays sharp. Increase your Reason by 1 (max 3). When you mark <strong>The Fathomless Well</strong>, do not decrease your Reason. "],
    "Come With Me If You Want to Live": ["You’re the kind of person who identifies all the exits when you arrive somewhere new. Once per session, when you and any other number of characters are facing grave harm, you can avoid that harm by narrating how you lead everyone to safety. "],
    "Knowing is Half the Battle": ["You’re a deep repository of knowledge, some of it even useful. Once per session, you can introduce a real-world fact about something in the scene. That fact is a Clue. "],
    "Say Hello to My Little Friend": ["You have an exceptionally smart dog with whom you share a strong bond. It can understand basic commands and perform simple tasks. What type of dog is it? Give the dog a name and add it to Your Corner of the House. When you use the dog to get advantage on a roll, leave it unmarked.", 
"Alternatively, you have a Tamagotchi you’ve been keeping alive since 1997. It has achieved a limited sentience, and you have learned to interpret its strange chirps and behaviors as a sort of oracle. Give the Tamagotchi a name and add it to Your Corner of the House. When you use the Tamagotchi to get advantage on a roll, leave it unmarked and roll with Sensitivity. "],
    "Who Ya Gonna Call?": ["You are active on the online forums for The Ghost Bro Mystery Show, a TV program about a group of young men and women, the Ghost Bros, who investigate haunted places in North America. Add The Ghost Bro Forums to Your Corner of the House. When you post a question about a Deep Lake mystery on the forums, roll with Presence. On a 10+, a commenter has a good answer or a Clue (Keeper’s choice), and they’ll share it freely. On a 7-9, as above, but they want you to do something for them before they’ll share it. On a miss, you inadvertently violate the forum’s inscrutable posting rules; you cannot use this move again until a Mystery is resolved. "],
    "Robot in Disguise": ["You came to Deep Lake with an array of electronic gadgets. Add the following to Your Corner of the House: Laptop, Walkie Talkies, GPS, Camcorder, Voice-Activated Audio Recorder."],
    "They Think He's a Righteous Dude": ["Something about you causes the motorheads, dweebs, and wastoids of Deep Lake to trust you. What is it? Once per session, when you do the Meddling Move in a place occupied by losers and social outcasts, you find an additional Clue, even on a miss."],
    "A Winner is You": ["You were a loser back then, but not anymore! People respect you now. Why? Increase your Presence by 1 (max 3). "],
    "I Am Error": ["You can mark <strong>The Chromatic Desert</strong> whenever you want. The other Latchkeys don’t forget who you are when you have it marked, and you can continue interacting with them so long as there is a television nearby: you appear on whatever program is being watched and can hear people when they speak to you through the TV. When the Latchkeys watch an Odyssey tape, your Latchkey scenes can take place inside the Odyssey tape scenes. "],
    "Thank You for Being a Friend": ["You’re easy to open up to. When you do the Nostalgic Move, the other Latchkey can clear a second Condition OR they can take the Condition: Feeling Good. They can clear Feeling Good at any time to get advantage on a die roll."],
    "The Truth is Out There": ["Someone who knows what happened to TV Odyssey is helping you behind the scenes. The Latchkeys immediately gain an Odyssey tape when you take this move—a gift from your mysterious benefactor. At the beginning of each session, this mysterious person leaves something for you where you can find it. Say what it is or ask the Keeper to say what it is. It functions as a Clue, but isn’t attached to any particular mystery—you can use it for an active mystery or save it for the future. The Keeper can reveal the identity of this mysterious helper during the Odyssey Mystery. "],
    "And They're Always Glad You Came": ["You have a family member that still lives in Deep Lake. Who are they? Any rolls associated with actions they help you with are made at advantage. Additionally, if you’re in immediate danger and can make it to their house, you’re safe until at least the next morning. "],
    "You Never Know What You're Gonna to Get": ["You have a background doing research. What is it? Once per session, when you do the Meddling Move by looking through books, microfiche, old records, or online archives, you find an additional Clue, even on a miss. "],
    "Have You Ever Danced with the Devil": ["You came to Deep Lake with a collection of tools for working black magic. Add the following to Your Corner of the House: Candles, Grimoire, Small Brazier, Athame, Poppet."],
    "Strange Things are Afoot at the Circle K": ["You believe in the fundamental goodness and power of convenience stores. Once per session, if something that can typically be found at a convenience store would be helpful in a situation and you take the time to go get it, say what it is and then add it to Your Corner of the House. "],
    "Just Say No": ["Something about your past makes you especially good at dealing with cops and their bullshit. What is it? Whenever you’re being harassed by the police or otherwise have to get out of a sticky situation involving law enforcement, all your associated die rolls are taken with advantage."],
    "Why Nintendon't": ["Once per session, you can take a 12+ on a single roll related to an action so long as you do it with cockiness or style."],
    "Next Sunday A.D.": ["Once per Day Phase, you and at least one other player can do an out-of-character narration of an upcoming scene, as if you were doing running commentary during a movie. At least one thing from your shared narration will be true about the upcoming scene; tell the Keeper what it is. The Keeper can decide that other elements from your narration are also true."]
}

export function adjustForMove(move: string): Partial<Character> | null {
    switch (move) {
        case "Where's the Beef?":
            return {
                abilities: {
                    vitality: 1,
                    composure: 0,
                    reason: 0,
                    presence: 0,
                    sensitivity: 0,
                },
            }
        case "This is Your Brain":
            return {
                abilities: {
                    reason: 1,
                    composure: 0,
                    presence: 0,
                    sensitivity: 0,
                    vitality: 0,
                },
            }
        case "Who Ya Gonna Call?":
            return {
                cornerOfTheHouse: [{marked: false, item: "The Ghost Bro Forums"}],
            }
        case "Robot in Disguise":
            return {
                cornerOfTheHouse: [{marked: false, item: "Laptop"}, {marked: false, item: "Walkie Talkies"}, {marked: false, item: "GPS"}, {marked: false, item: "Camcorder"}, {marked: false, item: "Voice-Activated Audio Recorder"}],
            }
        case "A Winner is You":
            return {
                abilities: {
                    presence: 1,
                    composure: 0,
                    reason: 0,
                    sensitivity: 0,
                    vitality: 0,
                },
            }
        case "Have You Ever Danced with the Devil":
            return {
                cornerOfTheHouse: [{marked: false, item: "Candles"}, {marked: false, item: "Grimoire"}, {marked: false, item: "Small Brazier"}, {marked: false, item: "Athame"}, {marked: false, item: "Poppet"}],
            }
        default:
            return null;
    }
}