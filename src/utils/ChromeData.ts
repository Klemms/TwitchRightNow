import {SchemaOrdering, TypeOrdering} from '@/types/SchemaOrdering.ts';
import {SchemaTwitch, TypeTwitch} from '@/types/SchemaTwitch.ts';
import {DisconnectionReason} from '@/utils/Errors.ts';
import type {Browser} from '@wxt-dev/browser';
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

async function getFollowedLivestreams(): Promise<Livestream[]> {
    return browser.storage.local
        .get('followedLivestreams')
        .then((values) => {
            if (Array.isArray(values['followedLivestreams'])) {
                return values['followedLivestreams'];
            } else {
                return [];
            }
        })
        .catch(() => []);
}

const SchemaFavorites = z.array(z.string()).default([]);
async function getFavorites(): Promise<string[]> {
    return browser.storage.sync
        .get('favoriteStreams')
        .then((val) => SchemaFavorites.parseAsync(val['favoriteStreams']))
        .catch(() => []);
}

async function isFavorite(login: string): Promise<boolean> {
    const favorites = await getFavorites();

    return favorites.some((value) => value === login);
}

async function setFavorite(login: string, isFavorite: boolean): Promise<void> {
    const favorites = await getFavorites();

    await browser.storage.sync.set({
        favoriteStreams: [
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

async function setNotifyAllStreams(notify: boolean): Promise<void> {
    await browser.storage.sync.set({
        notifyAllStreams: notify,
    });
}

async function getNotifyAllStreams(): Promise<boolean> {
    return browser.storage.sync
        .get('notifyAllStreams')
        .then((val) => (typeof val['notifyAllStreams'] === 'boolean' ? val['notifyAllStreams'] : false))
        .catch(() => false);
}

async function setStreamNotification(streamerLogin: string, notify: boolean): Promise<void> {
    const notifs = await getStreamNotifications();

    if (notify) {
        if (!notifs.includes(streamerLogin)) {
            await browser.storage.sync.set({
                notifiedStreams: [...notifs, streamerLogin],
            });
        }
    } else {
        await browser.storage.sync.set({
            notifiedStreams: notifs.toSpliced(notifs.indexOf(streamerLogin), 1),
        });
    }
}

const SchemaNotifiedStreams = z.array(z.string()).default([]);
async function getStreamNotifications(): Promise<string[]> {
    return browser.storage.sync
        .get('notifiedStreams')
        .then((val) => SchemaNotifiedStreams.parseAsync(val['notifiedStreams']))
        .catch(() => []);
}

async function setAlreadyNotified(streamerLogins: string[]): Promise<void> {
    await browser.storage.local.set({
        alreadyNotified: streamerLogins,
    });
}

async function getAlreadyNotified(): Promise<string[]> {
    return browser.storage.local
        .get('alreadyNotified')
        .then((val) => SchemaNotifiedStreams.parseAsync(val['alreadyNotified']))
        .catch(() => []);
}

async function emitStreamNotification(streamNotifs: Livestream[]) {
    let streamersFormatted = streamNotifs.map((stream) => stream.name || stream.login).join(', ');

    let title = browser.i18n.getMessage('notification_stream_multiple_title');
    switch (streamNotifs.length) {
        case 1:
            title = browser.i18n
                .getMessage('notification_stream_one_title')
                .replaceAll('%streamer%', streamNotifs[0].name || streamNotifs[0].login)
                .replaceAll('%game_game%', streamNotifs[0].game);
            streamersFormatted = streamNotifs[0].title || streamNotifs[0].game || '';
            break;
        case 2:
            streamersFormatted = browser.i18n.getMessage('notification_stream_two_message');
            title = browser.i18n
                .getMessage('notification_stream_two_title')
                .replaceAll('%streamer_1%', streamNotifs[0].name || streamNotifs[0].login)
                .replaceAll('%streamer_2%', streamNotifs[1].name || streamNotifs[1].login);
            break;
    }

    const goToButtons: Browser.notifications.NotificationButton[] = [];
    if (streamNotifs.length >= 1 && streamNotifs.length <= 2) {
        goToButtons.push({
            title: browser.i18n
                .getMessage('notification_stream_cta_channel')
                .replaceAll('%streamer%', streamNotifs[0].name || streamNotifs[0].login),
        });
    }
    if (streamNotifs.length === 2) {
        goToButtons.push({
            title: browser.i18n
                .getMessage('notification_stream_cta_channel')
                .replaceAll('%streamer%', streamNotifs[1].name || streamNotifs[1].login),
        });
    }

    return browser.notifications.create('ttv_streams_notif', {
        buttons: goToButtons,
        title: title,
        message: streamersFormatted,
        type: 'basic',
        contextMessage: 'Twitch Right Now',
        iconUrl:
            streamNotifs.length === 1
                ? streamNotifs[0].thumbnail.replace('{width}', '160').replace('{height}', '90')
                : 'images/icon.png',
    });
}

async function markAllStreamsAsNotified() {
    const streams = await ChromeData.getFollowedLivestreams();

    await ChromeData.setAlreadyNotified(streams.map((stream) => stream.login));
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
    setNotifyAllStreams,
    getNotifyAllStreams,
    setStreamNotification,
    getStreamNotifications,
    setAlreadyNotified,
    getAlreadyNotified,
    emitStreamNotification,
    getFollowedLivestreams,
    markAllStreamsAsNotified,
};
