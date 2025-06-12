import {ChromeData} from '@/utils/ChromeData.ts';
import {GetVideos} from '@/utils/TwitchResponses.ts';

export async function queryGetTwitchVideos(userId: string): Promise<TwitchVideo[]> {
    const clientId = await ChromeData.getTwitchClientId();
    const token = await ChromeData.getTwitchToken();

    if (clientId === null || token === null) {
        return Promise.reject('Invalid ClientId/Token');
    }

    const [resp0] = await Promise.all([
        fetch(`https://api.twitch.tv/helix/videos?user_id=${userId}&type=archive&sort=time`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Client-Id': clientId,
            },
        }),
    ]);

    if (resp0.status !== 200) {
        return Promise.reject(`Error : ${resp0.status}`);
    }

    const json0: {data: GetVideos[]} = await resp0.json();

    return json0.data.map((video) => ({
        id: video.id,
        streamId: video.stream_id,
        userId: video.user_id,
        login: video.user_login,
        name: video.user_name,
        title: video.title,
        description: video.description,
        creationDate: new Date(video.created_at),
        publicationDate: new Date(video.published_at),
        url: video.url,
        thumbnail: video.thumbnail_url.replaceAll('%{width}', '320').replaceAll('%{height}', '180'),
        views: video.view_count,
        language: video.language,
        type: video.type,
        duration: video.duration,
        mutedSegments: video?.muted_segments,
    }));
}
