export function queryGetUserData(): Promise<UserData> {
    return chrome.storage.sync.get('twitch').then(res => {
        if (res) {
            return {
                login: res.login,
                username: res.username,
                avatarURL: res.avatarURL,
                creationDate: res.creationDate,
            };
        }

        return Promise.reject();
    });
}