import {ChromeData} from '@/utils/ChromeData.ts';
import {GetChannelInformation, GetUserChatColor, GetUsers} from '@/utils/TwitchResponses.ts';

export async function queryGetTwitchChannelInformation(userId: string): Promise<ChannelInformations> {
    const clientId = await ChromeData.getTwitchClientId();
    const token = await ChromeData.getTwitchToken();

    if (clientId === null || token === null) {
        return Promise.reject('Invalid ClientId/Token');
    }

    const [resp0, resp1, resp2] = await Promise.all([
        fetch(`https://api.twitch.tv/helix/channels?broadcaster_id=${userId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Client-Id': clientId,
            },
        }),
        fetch(`https://api.twitch.tv/helix/users?id=${userId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Client-Id': clientId,
            },
        }),
        fetch(`https://api.twitch.tv/helix/chat/color?user_id=${userId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Client-Id': clientId,
            },
        }),
    ]);

    if (resp0.status !== 200 || resp1.status !== 200 || resp2.status !== 200) {
        return Promise.reject(`Error : ${resp0.status} / ${resp1.status} / ${resp2.status}`);
    }

    const json0: {data: GetChannelInformation[]} = await resp0.json();
    const json1: {data: GetUsers[]} = await resp1.json();
    const json2: {data: GetUserChatColor[]} = await resp2.json();

    return {
        userId: json0.data[0].broadcaster_id,
        login: json0.data[0].broadcaster_login,
        name: json0.data[0].broadcaster_name,
        accountType: json1.data[0].type,
        broadcasterType: json1.data[0].broadcaster_type,
        description: json1.data[0].description,
        avatar: json1.data[0].profile_image_url,
        offlineBackground: json1.data[0].offline_image_url,
        creationDate: new Date(json1.data[0].created_at),
        language: json0.data[0].broadcaster_language,
        game: json0.data[0].game_name,
        gameId: json0.data[0].game_id,
        title: json0.data[0].title,
        delay: json0.data[0].delay,
        tags: json0.data[0].tags,
        chatColor: json2.data[0].color,
    };
}
