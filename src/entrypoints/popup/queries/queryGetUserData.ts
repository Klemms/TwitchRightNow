import {ChromeData} from '@/utils/ChromeData.ts';

export async function queryGetUserData() {
    const userData = await ChromeData.getUserData();

    if (userData) {
        return {
            login: userData.login,
            username: userData.username,
            avatarURL: userData.avatarURL,
            creationDate: userData.creationDate,
        };
    }

    return Promise.reject();
}
