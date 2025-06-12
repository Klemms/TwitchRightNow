import {DisconnectionReason} from '@/utils/Errors.ts';

async function getTwitchToken(): Promise<string | null> {
    const twitchData = await browser.storage.sync.get(['twitch']);

    if (twitchData['twitch']?.token) {
        return twitchData['twitch'].token;
    } else {
        return null;
    }
}

async function getTwitchClientId(): Promise<string | null> {
    const twitchData = await browser.storage.sync.get(['twitch']);

    if (twitchData['twitch']?.clientId) {
        return twitchData['twitch'].clientId;
    } else {
        return null;
    }
}

async function getTwitchUserId(): Promise<string | null> {
    const twitchData = await browser.storage.sync.get(['twitch']);

    if (twitchData['twitch']?.userId) {
        return twitchData['twitch'].userId;
    } else {
        return null;
    }
}

async function getDisconnectionReason(): Promise<DisconnectionReason> {
    const reason = await browser.storage.sync.get(['disconnectionReason']);

    if (Object.values(DisconnectionReason).includes(reason['disconnectionReason'])) {
        return reason['disconnectionReason'];
    } else {
        return DisconnectionReason.NOT_CONNECTED;
    }
}

const defaultTwitchData = {
    token: null,
    clientId: null,
    userId: null,
    expirationDate: null,
    login: null,
    scopes: [],
    userData: {
        login: null,
        username: null,
        avatarURL: null,
        creationDate: null,
    },
};

async function setTwitchData(dataToMerge: Partial<TwitchData>): Promise<void> {
    const twitchData = (await browser.storage.sync.get(['twitch']))['twitch'];

    await browser.storage.sync.remove('disconnectionReason');

    return browser.storage.sync.set({
        twitch: {
            ...defaultTwitchData,
            ...twitchData,
            ...dataToMerge,
        },
    });
}

async function updateBadge(): Promise<void> {
    browser.storage.local.get('followedLivestreams').then((values) => {
        if (Array.isArray(values['followedLivestreams'])) {
            browser.action.setBadgeBackgroundColor({
                color: [96, 58, 140, 255],
            });
            browser.action.setBadgeText({
                text: values['followedLivestreams'].length.toString(),
            });
        }
    });
}

async function getFavorites(): Promise<string[]> {
    return (await browser.storage.sync.get('favoriteStreamers')).favoriteStreamers || [];
}

async function isFavorite(login: string): Promise<boolean> {
    const favorites = await getFavorites();

    return favorites.some((value) => value === login);
}

async function setFavorite(login: string, isFavorite: boolean): Promise<void> {
    const favorites = await getFavorites();

    await browser.storage.sync.set({
        favoriteStreamers: [
            ...favorites.filter((value) => value !== login || (value === login && isFavorite)),
            ...(isFavorite ? [login] : []),
        ],
    });
}

export const ChromeData = {
    setTwitchData,
    getTwitchToken,
    getTwitchClientId,
    getTwitchUserId,
    updateBadge,
    isFavorite,
    setFavorite,
    getFavorites,
    getDisconnectionReason,
};
