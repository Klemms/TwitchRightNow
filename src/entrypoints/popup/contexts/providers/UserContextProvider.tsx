import {UserContext} from '@/entrypoints/popup/contexts/UserContext.ts';
import {useEvent} from '@/entrypoints/popup/hooks/useEvent.ts';
import {queryGetUserData} from '@/entrypoints/popup/queries/queryGetUserData.ts';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {ReactNode, useCallback, useMemo} from 'react';

type UserContextProviderType = {
    children?: ReactNode;
};

export const UserContextProvider = function UserContextProvider({children}: UserContextProviderType) {
    const {data: userData, isSuccess} = useQuery({
        queryKey: [QueryKeys.USER_DATA],
        queryFn: () => queryGetUserData(),
    });

    const queryClient = useQueryClient();

    const onEvent = useCallback(() => {
        console.log('[UI] UserContextProvider::OnEvent');
        queryClient.resetQueries({queryKey: [QueryKeys.USER_DATA]});
    }, [queryClient]);
    useEvent(EventNames.DISCONNECTED, onEvent);
    useEvent(EventNames.CONNECTED, onEvent);

    const value = useMemo(
        () => ({
            isLoggedIn: isSuccess,
            login: userData?.login,
            username: userData?.username,
            avatarURL: userData?.avatarURL,
            creationDate: userData?.creationDate,
        }),
        [isSuccess, userData]
    );

    return <UserContext value={value}>{children}</UserContext>;
};
