import {useCallback, useEffect} from "react";

export function useOnHover(ref, callback) {
    const onMouseEnter = useCallback(() => {
        callback();
    }, [callback]);

    useEffect(() => {
        if (ref.current) {
            ref.current.addEventListener("mouseenter", onMouseEnter);
        }

        return () => {
            if (ref.current) {
                ref.current.removeEventListener("mouseenter", onMouseEnter);
            }
        };
    }, [ref]);
}
