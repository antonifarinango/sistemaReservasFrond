import { useEffect, useState } from "react";

export default function usePosicionesMesas() {
    const [posiciones, setPosiciones] = useState(getPosiciones(window.innerWidth));

    useEffect(() => {
        function handleResize() {
            setPosiciones(getPosiciones(window.innerWidth));
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return posiciones;
}

function getPosiciones(width) {
    if (width <= 1160) {
        // layout móvil o tablet
        return {
            1: { gridColumn: "1 / 3", gridRow: "1 / 2" },
            2: { gridColumn: "3 / 5", gridRow: "1 / 2" },
            3: { gridColumn: "5 / 7", gridRow: "1 / 2" },
            4: { gridColumn: "1 / 3", gridRow: "2 / 3" },
            5: { gridColumn: "3 / 5", gridRow: "2 / 3" },
            6: { gridColumn: "5 / 7", gridRow: "2 / 3" },
            7: { gridColumn: "1 / 3", gridRow: "3 / 4" },
            8: { gridColumn: "5 / 7", gridRow: "3 / 4" },
            9: { gridColumn: "1 / 3", gridRow: "4 / 5" },
            10: { gridColumn: "5 / 7", gridRow: "4 / 5" },
            11: { gridColumn: "1 / 3", gridRow: "5 / 6" },
            12: { gridColumn: "3 / 5", gridRow: "5 / 6" },
            13: { gridColumn: "5 / 7", gridRow: "5 / 6" },
            14: { gridColumn: "1 / 3", gridRow: "6 / 7" },
            15: { gridColumn: "3 / 5", gridRow: "6 / 7" },
            16: { gridColumn: "5 / 7", gridRow: "6 / 7" },
            17: { gridColumn: "3 / 5", gridRow: "3 / 5" }
        };
    } else {
        // layout desktop
        return {
            1: { gridColumn: "1 / 2", gridRow: "1 / 2" },
            2: { gridColumn: "1 / 2", gridRow: "2 / 3" },
            3: { gridColumn: "1 / 2", gridRow: "3 / 4" },
            4: { gridColumn: "1 / 2", gridRow: "4 / 5" },
            5: { gridColumn: "2 / 3", gridRow: "3 / 4" },
            6: { gridColumn: "2 / 3", gridRow: "4 / 5" },
            7: { gridColumn: "3 / 4", gridRow: "3 / 4" },
            8: { gridColumn: "3 / 4", gridRow: "4 / 5" },
            9: { gridColumn: "4 / 5", gridRow: "3 / 4" },
            10: { gridColumn: "4 / 5", gridRow: "4 / 5" },
            11: { gridColumn: "5 / 6", gridRow: "3 / 4" },
            12: { gridColumn: "5 / 6", gridRow: "4 / 5" },
            13: { gridColumn: "6 / 7", gridRow: "1 / 2" },
            14: { gridColumn: "6 / 7", gridRow: "2 / 3" },
            15: { gridColumn: "6 / 7", gridRow: "3 / 4" },
            16: { gridColumn: "6 / 7", gridRow: "4 / 5" },
            17: { gridColumn: "2 / 6", gridRow: "1 / 3" }
        };
    }



}

