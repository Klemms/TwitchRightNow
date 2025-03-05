declare module '*.scss' {
    const content: Record<string, string>;
    export default content;
}

declare type UserData = {
    login: string;
    username: string;
    avatarURL: string;
    creationDate: number;
}

declare type EventMessage = {
    type: string;
    data: any;
}