import {useCallback, useEffect, useRef} from 'react';

export function useTimeout(fn: () => void, delay: number, startInstantly = false) {
    const timeoutId = useRef(-1);

    const stop = useCallback(() => {
        if (timeoutId.current >= 0) {
            window.clearTimeout(timeoutId.current);
            timeoutId.current = -1;
        }
    }, []);

    const start = useCallback(() => {
        stop();
        timeoutId.current = window.setTimeout(fn, delay);
    }, [delay, fn, stop]);

    useEffect(() => {
        if (startInstantly) {
            start();
        }
    }, [start, startInstantly]);

    return {start, stop};
}
