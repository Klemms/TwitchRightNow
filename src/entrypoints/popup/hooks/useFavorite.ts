import {ChromeData} from '@/utils/ChromeData.ts';
import {QueryKeys} from '@/utils/QueryKeys.ts';
import {useQueryClient, useSuspenseQuery} from '@tanstack/react-query';
import {useCallback} from 'react';

export function useFavorite(login: string) {
    const {data: favorites, isPending} = useSuspenseQuery({
        queryKey: [QueryKeys.FAVORITE_STREAMER],
        queryFn: async () => {
            const res = await ChromeData.getFavorites();
            console.log('res', res);
            return res;
        },
        staleTime: 10_000,
    });

    const isFavorite = favorites.some((value) => value === login);

    const queryClient = useQueryClient();
    const setFavorite = useCallback(
        (favorite: boolean) => {
            ChromeData.setFavorite(login, favorite).then(() =>
                queryClient.invalidateQueries({queryKey: [QueryKeys.FAVORITE_STREAMER]})
            );
        },
        [login, queryClient]
    );

    return {
        isPending,
        isFavorite,
        setFavorite,
    };
}
