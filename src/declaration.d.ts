declare module '*.scss' {
    const content: Record<string, string>;
    export default content;
}

declare module '*.svg' {
    const content: any;
    export default content;
}

declare module '*.png' {
    const content: any;
    export default content;
}

declare interface Window {
    APP_READY: boolean;
}

declare type Ordering = 'ASCENDANT' | 'DESCENDANT';

declare type TwitchData = {
    token: string;
    clientId: string;
    userId: string;
    expirationDate: number;
    login: string;
    scopes: string[];
    userData: UserData;
};

declare type UserData = {
    login: string;
    username: string;
    avatarURL: string;
    creationDate: number;
};

declare type EventMessage = {
    type: string;
    data: any;
};

declare type CustomizableComponent = {
    className?: string;
    style?: CSSProperties;
};

declare type OnClick = (event: MouseEvent<T>, extraData: any) => void;

declare type Livestream = {
    game: string;
    id: string;
    language: string;
    login: string;
    name: string;
    startDate: number;
    tags: string[];
    thumbnail: string;
    title: string;
    isMature: boolean;
    userId: string;
    viewers: number;
};

declare type ChannelInformations = {
    userId: string;
    login: string;
    name: string;
    accountType: 'admin' | 'global_mod' | 'staff' | '';
    broadcasterType: 'affiliate' | 'partner' | '';
    description: string;
    avatar: string;
    offlineBackground: string;
    creationDate: Date;
    language: string;
    game: string;
    gameId: string;
    title: string;
    delay: number;
    tags: string[];
    chatColor: string;
};

declare type TwitchVideo = {
    id: string;
    streamId: string | null;
    userId: string;
    login: string;
    name: string;
    title: string;
    description: string;
    creationDate: Date;
    publicationDate: Date;
    url: string;
    thumbnail: string;
    views: number;
    language: string;
    type: string;
    duration: string;
    mutedSegments:
        | null
        | {
              duration: number;
              offset: number;
          }[];
};
