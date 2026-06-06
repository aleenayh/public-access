import PizzaIcon from "../../assets/icons/people/pizza.svg?react"
import CasetteIcon from "../../assets/icons/people/casette.svg?react"
import ArcadeIcon from "../../assets/icons/people/arcade.svg?react"
import CactusIcon from "../../assets/icons/people/cactus.svg?react"


export function HeaderNav() {
    //TODO

    return (
        <div className="flex items-center justify-evenly max-h-24">
            <FallbackIcon characterIndex={0} iconName="pizza" characterName="Sabrina Devine"/>
            <FallbackIcon characterIndex={1} iconName="casette" characterName="Chad Dickerson"/>
            <FallbackIcon characterIndex={2} iconName="arcade" characterName="Dr. Claw"/>
            <FallbackIcon characterIndex={3} iconName="cactus" characterName="Brandon Leer"/>
        </div>
    )

}


function FallbackIcon({characterIndex, iconName, characterName}: {characterIndex: number, iconName: string, characterName: string}) {
    const gradient = `linear-gradient(to right, hsl(${(characterIndex*50)}deg, 100%, 50%), hsl(${(characterIndex*50 + 100)}deg, 100%, 50%))`
    let icon: React.ReactNode
    switch (iconName) {
        case "pizza":
            icon = <PizzaIcon height={96}/>
            break
        case "casette":
            icon = <CasetteIcon height={96}/>
            break
        case "arcade":
            icon = <ArcadeIcon height={96}/>
            break
        case "cactus":
            icon = <CactusIcon height={96}/>
            break
        default:
            icon = <PizzaIcon height={96}/>
            break
    }

    const color = `hsl(${characterIndex*50 + 180}deg, 100%, 50%)`

    return <div className="isolate relative flex items-center justify-center max-w-1/5 h-full flex-col">
        <div className={`w-full h-full flex items-center justify-center border-2 border-theme-border-accent rounded-sm p-1 aspect-square hover:brightness-110 hover:saturate-150 transition-brightness duration-300 hover:-translate-y-6`} style={{background: gradient, color}}>
            {icon}
            </div>
            <p className="absolute bottom-0 -z-1 text-center text-theme-text-accent text-sm">{characterName}</p>
        </div>
}
