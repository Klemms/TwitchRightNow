import React, {useCallback, useEffect} from 'react';

export function useOnHover(ref: React.RefObject<HTMLDivElement | null>, callback: () => void) {
    const onMouseEnter = useCallback(() => {
        callback();
    }, [callback]);

    useEffect(() => {
        const current = ref.current;

        if (current) {
            current.addEventListener('mouseenter', onMouseEnter);
        }

        return () => {
            if (current) {
                current.removeEventListener('mouseenter', onMouseEnter);
            }
        };
    }, [onMouseEnter, ref]);
}
