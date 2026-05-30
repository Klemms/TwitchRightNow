export enum Errors {
    INVALID_TOKEN = 'invalid-token',
    SERVER_ERROR = 'server-error',
    GENERIC_ERROR = 'generic-error',
    DISCONNECT = 'disconnect',
    CONNECT = 'connect',
    RESET = 'reset',
}

export enum DisconnectionReason {
    NOT_CONNECTED = 'not-connected',
    EXPIRED_TOKEN = 'expired-token',
    VERSION_UPGRADE = 'version-upgrade',
}
