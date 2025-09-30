import {SchemaSearchChannels} from '@/types/SchemaSearchChannels.ts';
import {ChromeData} from '@/utils/ChromeData.ts';

export async function querySearchChannels(query: string, first = 3, liveOnly = false) {
    const clientId = await ChromeData.getTwitchClientId();
    const token = await ChromeData.getTwitchToken();

    if (clientId === null || token === null) {
        return Promise.reject('Invalid ClientId/Token');
    }

    const url = new URL('https://api.twitch.tv/helix/search/channels');
    url.searchParams.set('query', query);
    url.searchParams.set('first', String(first));
    url.searchParams.set('live_only', String(liveOnly));

    console.log('tatata', url);

    const res = SchemaSearchChannels.parse(
        await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Client-Id': clientId,
            },
        }).then((res) => {
            if (res.status !== 200) {
                return Promise.reject(`Error : ${res.status}`);
            }
            return res.json();
        })
    );

    console.log('tatata, res', url);

    return res.data;
}
