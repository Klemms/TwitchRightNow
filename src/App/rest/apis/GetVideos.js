import {HelixBackend} from '../backends/Helix';
import Endpoint from '../Endpoint';
import GetStreamerVideosProcessor from '../processors/GetStreamerVideosProcessor';
import ChromeData from '../../../ChromeData';
import GetVideoProcessor from '../processors/GetVideoProcessor';

export function getStreamerVideos(userID, max = 10) {
    return ChromeData.getAuthData().then(([clientID, ttvToken]) => {
        return HelixBackend.sendRequest('get-streamer-videos', null, {
            user_id: userID,
            first: max
        }, {
            Authorization: `Bearer ${ttvToken}`,
            'Client-Id': clientID
        }).then(result => {
            return result
        }).catch(error => {
            console.error('[getStreamerVideos] Uncaught errors occurred')
            return [];
        });
    });
}

export function getVideo(videoID) {
    return ChromeData.getAuthData().then(([clientID, ttvToken]) => {
        return HelixBackend.sendRequest('get-video', null, {
            id: videoID
        }, {
            Authorization: `Bearer ${ttvToken}`,
            'Client-Id': clientID
        }).then(result => {
            return result
        }).catch(error => {
            console.error('[getVideo] Uncaught errors occurred')
            return [];
        });
    });
}

export function initGetVideos() {
    HelixBackend.registerEndpoint(new Endpoint({
        name: 'get-streamer-videos',
        path: 'videos',
        method: 'GET',
        contentType: 'application/json',
        dataProcessor: new GetStreamerVideosProcessor(),
        cacheDuration: 60,
        headers: [
            {
                name: 'Authorization',
                required: true
            },
            {
                name: 'Client-Id',
                required: true
            }
        ],
        parameters: [
            {
                name: 'user_id',
                required: true
            },
            {
                name: 'sort',
                required: true,
                default: 'time'
            },
            {
                name: 'type',
                required: true,
                default: 'archive'
            },
            {
                name: 'first',
                required: true,
                default: 10
            }
        ]
    }));

    HelixBackend.registerEndpoint(new Endpoint({
        name: 'get-video',
        path: 'videos',
        method: 'GET',
        contentType: 'application/json',
        dataProcessor: new GetVideoProcessor(),
        cacheDuration: 60,
        headers: [
            {
                name: 'Authorization',
                required: true
            },
            {
                name: 'Client-Id',
                required: true
            }
        ],
        parameters: [
            {
                name: 'id',
                required: true
            }
        ]
    }));
}
