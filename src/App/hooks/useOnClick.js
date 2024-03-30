import {useCallback, useEffect} from "react";

export function useOnClick(ref, callback) {
    const onClick = useCallback(() => {
        callback();
    }, [callback]);

    useEffect(() => {
        if (ref.current) {
            ref.current.addEventListener("click", onClick);
        }

        return () => {
            if (ref.current) {
                ref.current.removeEventListener("click", onClick);
            }
        };
    }, [ref.current]);
}
