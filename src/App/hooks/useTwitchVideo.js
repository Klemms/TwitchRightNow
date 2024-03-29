import {useEffect, useState} from 'react';
import {getVideo} from '../rest/apis/GetVideos';

export function useTwitchVideo(videoID) {
    const [data, setData] = useState(null);

    useEffect(() => {
        if (videoID) {
            getVideo(videoID).then(result => {
                setData(result);
            });
        }
    }, [videoID]);

    return data;
}
