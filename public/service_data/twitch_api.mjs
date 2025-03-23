import {ChromeData} from './chrome_data.js';
import {Events} from './events.js';

/**
 * Validates the current Twitch Token
 * @param twitchToken If omitted, will use the stored token
 * @returns {Promise<never>} Rejects on errors, otherwise sets the clientId/userId/login and returns them for ease of use.
 */
async function validateTwitchToken(twitchToken = null) {
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
                return Promise.reject();
            } else if (res.status === 200) {
                return chrome.storage.local
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
                return Promise.reject('twitch-api-generic-error');
            }
        });
    } else {
        return Promise.reject('invalid-twitch-token');
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
                return Promise.reject();
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
                        return Promise.reject('twitch-api-no-user');
                    }
                });
            } else {
                console.log('An error occurred while validating Twitch Token, Status :', res.status);
                return Promise.reject('twitch-api-generic-error');
            }
        });
    } else {
        handleInvalidTwitchToken();
        return Promise.reject('invalid-twitch-data');
    }
}

function handleInvalidTwitchToken() {
    console.log('Twitch token is no longer valid');
    // TODO: Disconnect User

    chrome.storage.sync
        .set({
            twitch: undefined,
        })
        .then(() => {
            Events.sendEvent(Events.EventNames.DISCONNECTED);
        });
}

function getFollowedLiveStreams(userId, token, clientId, after = false) {
    return fetch(
        `https://api.twitch.tv/helix/streams/followed?user_id=${userId}&first=100${after !== false ? `&after=${after}` : ''}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Client-Id': clientId,
            },
        }
    ).then((res) => {
        if (res.status === 401) {
            handleInvalidTwitchToken();
            return Promise.reject();
        } else if (res.status === 200) {
            return res.json().then((json) => {
                if (Array.isArray(json.data)) {
                    return {
                        cursor: json?.pagination?.cursor,
                        streams: json.data.map((stream) => ({
                            id: stream.id,
                            userId: stream.user_id,
                            login: stream.user_login,
                            name: stream.user_name,
                            game: stream.game_name,
                            title: stream.title,
                            viewers: stream.viewer_count,
                            thumbnail: stream.thumbnail_url,
                            startDate: new Date(stream.started_at).getTime(),
                            language: stream.language,
                            tags: stream.tags,
                        })),
                    };
                } else {
                    console.log('An error occurred while getting followed streams, Status :', res.status);
                    return Promise.reject('twitch-api-generic-error');
                }
            });
        } else {
            console.log('An error occurred while getting followed streams, Status :', res.status);
            return Promise.reject('twitch-api-generic-error');
        }
    });
}

async function updateFollowedLiveStreams() {
    try {
        const token = await ChromeData.getTwitchToken();
        const clientId = await ChromeData.getTwitchClientId();
        const userId = await ChromeData.getTwitchUserId();

        if (token && clientId && userId) {
            let hasNext = true;
            let cursor = false;
            let results = [];

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

            return chrome.storage.local
                .set({
                    followedLivestreams: results,
                })
                .then(() => {
                    Events.sendEvent(Events.EventNames.LIVESTREAMS_UPDATE, results);
                    return results;
                });
        } else {
            handleInvalidTwitchToken();
            return Promise.reject('invalid-twitch-data');
        }
    } catch (e) {
        handleInvalidTwitchToken();
        console.error(e);
        return Promise.reject('invalid-twitch-data');
    }
}

export const TwitchAPI = {
    validateTwitchToken,
    updateUserData,
    updateFollowedLiveStreams,
};
