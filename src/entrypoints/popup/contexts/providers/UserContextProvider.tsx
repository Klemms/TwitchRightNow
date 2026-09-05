import {UserContext} from '@/entrypoints/popup/contexts/UserContext.ts';
import {useEvent} from '@/entrypoints/popup/hooks/useEvent.ts';
import {queryGetUserData} from '@/entrypoints/popup/queries/queryGetUserData.ts';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {type ReactNode, useCallback, useMemo} from 'react';

type UserContextProviderType = {
    children?: ReactNode;
};

export function UserContextProvider({children}: UserContextProviderType) {
    const {data: userData, isSuccess} = useQuery({
        queryKey: [QueryKeys.USER_DATA],
        queryFn: () => queryGetUserData(),
        staleTime: 600_000,
    });

    const isLoggedIn = useMemo(
        () =>
            !!(
                isSuccess &&
                userData &&
                userData.username &&
                userData.login &&
                userData.creationDate &&
                userData.avatarURL
            ),
        [isSuccess, userData]
    );

    const queryClient = useQueryClient();

    const onEvent = useCallback(() => {
        queryClient.resetQueries({queryKey: [QueryKeys.USER_DATA]});
    }, [queryClient]);
    useEvent(EventNames.DISCONNECTED, onEvent);
    useEvent(EventNames.CONNECTED, onEvent);

    const value = useMemo(
        () => ({
            isLoggedIn: isLoggedIn,
            login: userData?.login || '',
            username: userData?.username || '',
            avatarURL: userData?.avatarURL || '',
            creationDate: userData?.creationDate || 0,
        }),
        [isLoggedIn, userData]
    );

    return <UserContext value={value}>{children}</UserContext>;
}
