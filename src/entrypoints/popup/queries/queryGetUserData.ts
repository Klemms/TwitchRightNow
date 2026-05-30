export async function queryGetUserData(): Promise<UserData> {
    const {twitch} = await browser.storage.sync.get('twitch');

    if (twitch && twitch.userData) {
        return {
            login: twitch.userData.login,
            username: twitch.userData.username,
            avatarURL: twitch.userData.avatarURL,
            creationDate: twitch.userData.creationDate,
        };
    }

    return Promise.reject();
}
