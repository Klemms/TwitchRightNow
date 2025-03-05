async function getTwitchToken() {
    const twitchData = await chrome.storage.sync.get(['twitch']);

    if (twitchData['twitch']?.token) {
        return twitchData['twitch'].token;
    } else {
        return null;
    }
}

async function getTwitchClientId() {
    const twitchData = await chrome.storage.sync.get(['twitch']);

    if (twitchData['twitch']?.clientId) {
        return twitchData['twitch'].clientId;
    } else {
        return null;
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
    }
};

async function setTwitchData(dataToMerge) {
    let twitchData = (await chrome.storage.sync.get(['twitch']))['twitch'];

    return chrome.storage.sync.set({
        twitch: {
            ...defaultTwitchData,
            ...twitchData,
            ...dataToMerge,
        },
    });
}

export const ChromeData = {
    setTwitchData,
    getTwitchToken,
    getTwitchClientId,
};
