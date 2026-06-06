import { useMemo } from "react"
import { usePreferences } from "../context/PreferencesContext"



function StaticBackground() {
    return (
        <div className="isolate h-full w-full absolute inset-0">
        <div className="BackgroundColor"></div>
        <div className="StaticBackground"></div>
        <div className="StaticForeground"/>
        <div className="StaticForeground -right-5"/>
        <div className="StaticForeground -right-15"/>
        </div>
    )
}

function GeometricShapeBackground() {
    const dynamicStyles = useMemo(() => {
					const neonColors = [
						"hsl(0, 100%, 50%)",
						"hsl(30, 100%, 50%)",
						"hsl(66, 100%, 50%)",
						"hsl(120, 100%, 50%)",
						"hsl(200, 100%, 50%)",
						"hsl(280, 100%, 50%)",
						"hsl(300, 100%, 50%)",
					];
					return new Array(60)
						.fill("")
						.map((_, index) => {
                            // eslint-disable-next-line react-hooks/purity
                            let topVal = Math.floor(Math.random() * 90)
                            // eslint-disable-next-line react-hooks/purity
                            let leftVal = Math.floor(Math.random() * 90)
                            if (50 > topVal && topVal > 30 && leftVal > 40 && leftVal < 60) { topVal -=10 }
                            if (50 > topVal && topVal > 70 && leftVal > 40 && leftVal < 60) { topVal += 10 }

                            if (50 > leftVal && leftVal > 40 && topVal > 30 && topVal < 70) { leftVal -=10 }
                            if (50 > leftVal && leftVal > 60 && topVal > 30 && topVal < 70) { leftVal += 10 }
							return {
								top: `${topVal}%`,
								left: `${leftVal}%`,
								"--shape-color": neonColors[index % neonColors.length],
                                "--animation-delay": `${index * 0.05}s`,
                                // eslint-disable-next-line react-hooks/purity
                                "--animation-speed-variance": `${Math.floor(Math.random() * 4) + 1}s`,
							};
						});
				}, [])

    return (
        <div className="isolate h-full w-full absolute inset-0">
            <div className="BackgroundColor"></div>
            <div className={`Triangle rotate-45`} style={dynamicStyles[0]}></div>
            <div className={`Triangle rotate-10`} style={dynamicStyles[1]}></div>
            <div className={`Triangle rotate-180`} style={dynamicStyles[2]}></div>
            <div className={`Triangle rotate-270`} style={dynamicStyles[3]}></div>
            <div className={`Triangle rotate-30`} style={dynamicStyles[4]}></div>
            <div className={`Triangle rotate-10`} style={dynamicStyles[5]}></div>
            <div className={`Triangle rotate-45`} style={dynamicStyles[6]}></div>

            <div className={`Circle`} style={dynamicStyles[7]}></div>
            <div className={`Circle`} style={dynamicStyles[8]}></div>
            <div className={`Circle`} style={dynamicStyles[9]}></div>
            <div className={`Circle`} style={dynamicStyles[10]}></div>
            <div className={`Circle`} style={dynamicStyles[11]}></div>
            <div className={`Circle`} style={dynamicStyles[12]}></div>
            <div className={`Circle`} style={dynamicStyles[13]}></div>

            <div className={`CircleFilled`} style={dynamicStyles[14]}></div>
            <div className={`CircleFilled`} style={dynamicStyles[15]}></div>
            <div className={`CircleFilled`} style={dynamicStyles[16]}></div>
            <div className={`CircleFilled`} style={dynamicStyles[17]}></div>
            <div className={`CircleFilled`} style={dynamicStyles[18]}></div>
            <div className={`CircleFilled`} style={dynamicStyles[19]}></div>

            <div className={`Triangle rotate-45`} style={dynamicStyles[20]}></div>
            <div className={`Triangle rotate-10`} style={dynamicStyles[21]}></div>
            <div className={`Triangle rotate-180`} style={dynamicStyles[22]}></div>
            <div className={`Triangle rotate-270`} style={dynamicStyles[23]}></div>
            <div className={`Triangle rotate-30`} style={dynamicStyles[24]}></div>
            <div className={`Triangle rotate-10`} style={dynamicStyles[25]}></div>
            <div className={`Triangle rotate-45`} style={dynamicStyles[26]}></div>

            <div className={`Circle`} style={dynamicStyles[27]}></div>
            <div className={`Circle`} style={dynamicStyles[28]}></div>
            <div className={`Circle`} style={dynamicStyles[29]}></div>
            <div className={`Circle`} style={dynamicStyles[30]}></div>
            <div className={`Circle`} style={dynamicStyles[31]}></div>
            <div className={`Circle`} style={dynamicStyles[32]}></div>
            <div className={`Circle`} style={dynamicStyles[33]}></div>

            <div className={`Rectangle rotate-6`} style={dynamicStyles[34]}></div>
            <div className={`Rectangle rotate-30`} style={dynamicStyles[35]}></div>
            <div className={`Rectangle rotate-45`} style={dynamicStyles[36]}></div>
            <div className={`Rectangle rotate-10`} style={dynamicStyles[37]}></div>
            <div className={`Rectangle rotate-35`} style={dynamicStyles[38]}></div>
            <div className={`Rectangle rotate-60`} style={dynamicStyles[39]}></div>
            <div className={`Rectangle rotate-40`} style={dynamicStyles[40]}></div>
        </div>
    )
}

export function BackgroundAnimations() {
    const {theme } = usePreferences();

    if (theme === "analog") {
        return <StaticBackground />;
    } else if (theme === "eighties") {
        return <GeometricShapeBackground />;
    } else {
        return null;
    }
}