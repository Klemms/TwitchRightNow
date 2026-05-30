import {queryGetTwitchChannelInformation} from '@/entrypoints/popup/queries/queryGetTwitchChannelInformation.ts';
import {QueryKeys} from '@/utils/QueryKeys.ts';
import {useSuspenseQuery} from '@tanstack/react-query';

export function useChannelInformations(userId: string) {
    const {data: channel} = useSuspenseQuery<ChannelInformations>({
        queryKey: [QueryKeys.CHANNEL_INFORMATIONS, userId],
        queryFn: () => queryGetTwitchChannelInformation(userId),
        staleTime: 600_000,
    });

    return channel;
}
