import {ChromeData} from '@/utils/ChromeData.ts';
import {QueryKeys} from '@/utils/QueryKeys.ts';
import {useQueryClient, useSuspenseQuery} from '@tanstack/react-query';
import {useCallback} from 'react';

export function useNotification(login: string) {
    const {data: streams, isPending} = useSuspenseQuery({
        queryKey: [QueryKeys.STREAMS_TO_NOTIFY],
        queryFn: () => ChromeData.getStreamNotifications(),
        staleTime: 10_000,
    });

    const isNotified = streams.some((value) => value === login);

    const queryClient = useQueryClient();
    const setToNotify = useCallback(
        (notify: boolean) => {
            ChromeData.setStreamNotification(login, notify).then(() =>
                queryClient.invalidateQueries({queryKey: [QueryKeys.STREAMS_TO_NOTIFY]})
            );
        },
        [login, queryClient]
    );

    return {
        isPending,
        isNotified,
        setToNotify,
    };
}
