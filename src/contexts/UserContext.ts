import {createContext} from "react";

type UserContextType = {
    isLoggedIn: boolean;
    login: string | undefined;
    username: string | undefined;
    avatarURL: string | undefined;
    creationDate: number | undefined;
};

export const UserContext = createContext<UserContextType>({
    isLoggedIn: false,
    login: undefined,
    username: undefined,
    avatarURL: undefined,
    creationDate: undefined,
});