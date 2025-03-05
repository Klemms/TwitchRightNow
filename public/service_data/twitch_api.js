import {ChromeData} from './chrome_data.js';

/**
 * Validates the current Twitch Token
 * @param twitchToken If omitted, will use the stored token
 * @returns {Promise<never>} Rejects on errors, otherwise sets the clientId/userId/login and returns them for ease of use.
 */
async function validateTwitchToken(twitchToken = null) {
    const token = twitchToken || await ChromeData.getTwitchToken();

    if (token) {
        return fetch('https://id.twitch.tv/oauth2/validate', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }).then(res => {
            if (res.status === 401) {
                handleInvalidTwitchToken();
                return Promise.reject();
            } else if (res.status === 200) {
                return chrome.storage.local.set({
                    twitchTokenLastRefresh: Date.now()
                })
                    .then(() => res.json())
                    .then(json => {
                        return ChromeData.setTwitchData({
                            clientId: json['client_id'],
                            userId: json['user_id'],
                            login: json['login'],
                            scopes: json['scopes'],
                            expirationDate: Date.now() + (json['expires_in'] * 1000),
                        }).then(() => {
                            return {
                                clientId: json['client_id'],
                                userId: json['user_id'],
                                login: json['login'],
                                scopes: json['scopes'],
                                expirationDate: Date.now() + (json['expires_in'] * 1000),
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
    const token = await ChromeData.getTwitchToken()
    const clientId = await ChromeData.getTwitchClientId()

    if (token && clientId) {
        return fetch('https://api.twitch.tv/helix/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Client-Id': clientId
            }
        }).then(res => {
            if (res.status === 401) {
                handleInvalidTwitchToken();
                return Promise.reject();
            } else if (res.status === 200) {
                return res.json().then(json => {
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
}

export const TwitchAPI = {
    validateTwitchToken,
    updateUserData,
};
