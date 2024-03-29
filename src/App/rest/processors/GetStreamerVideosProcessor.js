import DataProcessor from '../DataProcessor';

export default class GetStreamerVideosProcessor extends DataProcessor {
    process(inputData) {
        return Promise.resolve(inputData.data.map(vod => {
            return {
                id: vod.id,
                duration: vod.duration,
                date: vod.created_at,
                title: vod.title,
                views: vod.view_count,
                thumbnail: vod.thumbnail_url,
                language: vod.language,
                url: vod.url
            }
        }));
    }
}
