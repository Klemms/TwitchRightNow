import {useEffect} from 'react';

export function useInterval(interval: number, callback: () => void) {
    useEffect(() => {
        const id = window.setInterval(() => {
            callback();
        }, interval);

        return () => {
            window.clearInterval(id);
        };
    }, [interval, callback]);
}
