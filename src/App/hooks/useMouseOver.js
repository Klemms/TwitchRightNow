import {useCallback, useEffect, useState} from "react";

export function useMouseOver(ref) {
    const [isHovered, setHovered] = useState(false);

    const onMouseEnter = useCallback(() => {
        setHovered(true);
    }, []);
    const onMouseLeave = useCallback(() => {
        setHovered(false);
    }, []);

    useEffect(() => {
        if (ref.current) {
            ref.current.addEventListener("mouseenter", onMouseEnter);
            ref.current.addEventListener("mouseleave", onMouseLeave);
        }

        return () => {
            if (ref.current) {
                ref.current.removeEventListener("mouseenter", onMouseEnter);
                ref.current.removeEventListener("mouseleave", onMouseLeave);
            }
        };
    }, [ref.current]);

    return isHovered;
}
