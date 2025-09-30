import {useTimeout} from '@/entrypoints/popup/hooks/useTimeout.ts';
import {useQuery} from '@tanstack/react-query';
import {useEffect, useState} from 'react';

export function useDelayedQuery<T>(
    queryKey: string[],
    queryFn: () => Promise<T>,
    isEnabled = true,
    dependency: any = true
) {
    const [enabled, setEnabled] = useState(false);

    const {start} = useTimeout(() => {
        setEnabled(true);
    }, 500);

    useEffect(() => {
        console.log('EFFECT');
        start();
    }, [queryKey, start, dependency]);

    return useQuery({
        queryKey: queryKey,
        queryFn: () => {
            console.log('DOING QUERY');
            return queryFn;
        },
        enabled: isEnabled && enabled,
    });
}
