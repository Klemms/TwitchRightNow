import {UserContext} from "../UserContext.ts";
import {ReactNode, useCallback, useMemo} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {QueryKeys} from "../../QueryKeys.ts";
import {queryGetUserData} from "../../queries/queryGetUserData.ts";
import {useEvent} from "../../hooks/useEvent.tsx";
import {EventNames} from "../../EventNames.ts";

type UserContextProviderType = {
    children?: ReactNode;
}

export const UserContextProvider = function UserContextProvider({
                                                                    children
                                                                }: UserContextProviderType) {
    const {data: userData, isSuccess} = useQuery({
        queryKey: [QueryKeys.USER_DATA],
        queryFn: () => queryGetUserData(),
    });

    const queryClient = useQueryClient();
    const onDisconnect = useCallback(() => {
        console.log('[UI] UserContextProvider::Disconnected');
        queryClient.resetQueries({queryKey: [QueryKeys.USER_DATA]});
    }, []);
    useEvent(EventNames.DISCONNECTED, onDisconnect);

    const value = useMemo(() => ({
        isLoggedIn: isSuccess,
        login: userData?.login,
        username: userData?.username,
        avatarURL: userData?.avatarURL,
        creationDate: userData?.creationDate,
    }), []);

    return (
        <UserContext value={value}>
            {children}
        </UserContext>
    );
}