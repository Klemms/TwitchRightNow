import {SchemaOrdering, TypeOrdering} from '@/types/SchemaOrdering.ts';
import {SchemaTwitch, TypeTwitch} from '@/types/SchemaTwitch.ts';
import {DisconnectionReason} from '@/utils/Errors.ts';
import * as z from 'zod';

async function getTwitchData() {
    return browser.storage.sync.get('twitch').then((res) => SchemaTwitch.parseAsync(res['twitch']));
}

async function getTwitchToken(): Promise<string | null> {
    const twitchData = await getTwitchData();
    return twitchData.token;
}

async function getTwitchClientId(): Promise<string | null> {
    const twitchData = await getTwitchData();
    return twitchData.clientId;
}

async function getTwitchUserId(): Promise<string | null> {
    const twitchData = await getTwitchData();
    return twitchData.userId;
}

async function getDisconnectionReason(): Promise<string> {
    const reason = await browser.storage.sync.get('disconnectionReason');
    const disco = reason['disconnectionReason'];

    if (typeof disco === 'string' && disco.length > 0) {
        return disco;
    }

    return DisconnectionReason.NOT_CONNECTED;
}

const defaultTwitchData: TypeTwitch = {
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

async function setTwitchData(dataToMerge: Partial<TypeTwitch>): Promise<void> {
    const twitchData = await getTwitchData();

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
    const disconnectionReason = (await browser.storage.sync.get('disconnectionReason'))['disconnectionReason'];

    if (typeof disconnectionReason === 'string' && disconnectionReason.length > 0) {
        void browser.action.setBadgeBackgroundColor({
            color: [196, 27, 27, 255],
        });
        void browser.action.setBadgeText({
            text: '!',
        });
        return;
    }

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

const SchemaFavorites = z.array(z.string()).default([]);
async function getFavorites(): Promise<string[]> {
    return browser.storage.sync
        .get('favoriteStreamers')
        .then((val) => SchemaFavorites.parseAsync(val['favoriteStreamers']))
        .catch(() => []);
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

async function setOrdering(order: TypeOrdering): Promise<void> {
    await browser.storage.sync.set({
        ordering: order,
    });
}

async function getOrdering(): Promise<TypeOrdering> {
    return browser.storage.sync
        .get('ordering')
        .then((val) => SchemaOrdering.parseAsync(val['ordering']))
        .catch(() => 'DESCENDANT');
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
    setOrdering,
    getOrdering,
};
