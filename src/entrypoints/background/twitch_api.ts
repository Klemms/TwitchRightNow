import {Events} from '@/entrypoints/background/events.ts';
import {ChromeData} from '@/utils/ChromeData.ts';
import {Errors} from '@/utils/Errors.ts';
import {EventNames} from '@/utils/EventNames.ts';
import {GetFollowedStreams, GetFollowedStreamsData} from '@/utils/TwitchResponses.ts';

/**
 * Validates the current Twitch Token
 * @param twitchToken If omitted, will use the stored token
 * @returns Rejects on errors, otherwise sets the clientId/userId/login and returns them for ease of use.
 */
async function validateTwitchToken(twitchToken: string | null = null) {
    const token = twitchToken || (await ChromeData.getTwitchToken());

    if (token) {
        return fetch('https://id.twitch.tv/oauth2/validate', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            if (res.status === 401) {
                handleInvalidTwitchToken();
                return Promise.reject(Errors.INVALID_TOKEN);
            } else if (res.status === 200) {
                return browser.storage.local
                    .set({
                        twitchTokenLastRefresh: Date.now(),
                    })
                    .then(() => res.json())
                    .then((json) => {
                        return ChromeData.setTwitchData({
                            clientId: json['client_id'],
                            userId: json['user_id'],
                            login: json['login'],
                            scopes: json['scopes'],
                            expirationDate: Date.now() + json['expires_in'] * 1000,
                        }).then(() => {
                            return {
                                clientId: json['client_id'],
                                userId: json['user_id'],
                                login: json['login'],
                                scopes: json['scopes'],
                                expirationDate: Date.now() + json['expires_in'] * 1000,
                            };
                        });
                    });
            } else {
                console.log('An error occurred while validating Twitch Token, Status :', res.status);
                return Promise.reject(Errors.SERVER_ERROR);
            }
        });
    } else {
        return Promise.reject(Errors.INVALID_TOKEN);
    }
}

async function updateUserData() {
    const token = await ChromeData.getTwitchToken();
    const clientId = await ChromeData.getTwitchClientId();

    if (token && clientId) {
        return fetch('https://api.twitch.tv/helix/users', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Client-Id': clientId,
            },
        }).then((res) => {
            if (res.status === 401) {
                handleInvalidTwitchToken();
                return Promise.reject(Errors.INVALID_TOKEN);
            } else if (res.status === 200) {
                return res.json().then((json) => {
                    if (Array.isArray(json.data) && json.data.length === 1) {
                        const user = json.data[0];
                        const userData = {
                            login: user.login,
                            username: user.display_name,
                            avatarURL: user.profile_image_url,
                            creationDate: new Date(user.created_at).getTime(),
                        };

                        return ChromeData.setTwitchData({userData: userData}).then(() => userData);
                    } else {
                        console.log("Twitch API didn't return a user");
                        return Promise.reject(Errors.GENERIC_ERROR);
                    }
                });
            } else {
                console.log('An error occurred while validating Twitch Token, Status :', res.status);
                return Promise.reject(Errors.SERVER_ERROR);
            }
        });
    } else {
        handleInvalidTwitchToken();
        return Promise.reject(Errors.INVALID_TOKEN);
    }
}

function handleInvalidTwitchToken() {
    console.log('Twitch token is no longer valid');
    // TODO: Disconnect User

    browser.storage.sync
        .set({
            twitch: undefined,
        })
        .then(() => {
            Events.sendEvent(EventNames.DISCONNECTED);
        });
}

async function getFollowedLiveStreams(
    userId: string,
    token: string,
    clientId: string,
    after: false | string = false
): Promise<{cursor: string | undefined; streams: Livestream[]}> {
    try {
        const response = await fetch(
            `https://api.twitch.tv/helix/streams/followed?user_id=${userId}&first=100${after !== false ? `&after=${after}` : ''}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Client-Id': clientId,
                },
            }
        );

        if (response.status === 401) {
            handleInvalidTwitchToken();
            return Promise.reject(Errors.INVALID_TOKEN);
        } else if (response.status === 200) {
            const json: GetFollowedStreams = await response.json();

            if (Array.isArray(json.data)) {
                return {
                    cursor: json.pagination?.cursor,
                    streams: json.data.map((stream: GetFollowedStreamsData) => ({
                        id: stream.id,
                        userId: stream.user_id,
                        login: stream.user_login,
                        name: stream.user_name || '',
                        game: stream.game_name || '',
                        title: stream.title || '',
                        viewers: stream.viewer_count || -42,
                        thumbnail: stream.thumbnail_url || '',
                        startDate: new Date(stream.started_at).getTime() || Date.now(),
                        language: stream.language || 'fr',
                        isMature: stream.is_mature || false,
                        tags: stream.tags || [],
                    })),
                };
            } else {
                console.log('An error occurred while getting followed streams, Status :', response.status);
                return Promise.reject(Errors.GENERIC_ERROR);
            }
        } else {
            console.log('An error occurred while getting followed streams, Status :', response.status);
            return Promise.reject(Errors.SERVER_ERROR);
        }
    } catch (e) {
        console.error('An error occurred while getting followedd streams, Status :', e);
        return Promise.reject(Errors.GENERIC_ERROR);
    }
}

async function updateFollowedLiveStreams() {
    try {
        const token = await ChromeData.getTwitchToken();
        const clientId = await ChromeData.getTwitchClientId();
        const userId = await ChromeData.getTwitchUserId();

        if (token && clientId && userId) {
            let hasNext = true;
            let cursor: string | false = false;
            let results: Livestream[] = [];

            while (hasNext) {
                await getFollowedLiveStreams(userId, token, clientId, cursor).then((res) => {
                    results = [...results, ...res.streams];

                    if (res.cursor) {
                        cursor = res.cursor;
                    } else {
                        hasNext = false;
                    }
                });
            }

            return browser.storage.local
                .set({
                    followedLivestreams: results,
                })
                .then(() => {
                    Events.sendEvent(EventNames.LIVESTREAMS_UPDATE, results);
                    return results;
                })
                .finally(() => {
                    ChromeData.updateBadge();
                });
        } else {
            handleInvalidTwitchToken();
            return Promise.reject(Errors.INVALID_TOKEN);
        }
    } catch (e) {
        handleInvalidTwitchToken();
        console.error(e);
        return Promise.reject(Errors.INVALID_TOKEN);
    }
}

export const TwitchAPI = {
    validateTwitchToken,
    updateUserData,
    updateFollowedLiveStreams,
};
