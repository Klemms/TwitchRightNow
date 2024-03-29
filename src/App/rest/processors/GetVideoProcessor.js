import DataProcessor from '../DataProcessor';

export default class GetVideoProcessor extends DataProcessor {
    process(inputData) {
        const data = inputData.data[0];

        return Promise.resolve({
            id: data.id,
            duration: data.duration,
            date: data.created_at,
            title: data.title,
            views: data.view_count,
            thumbnail: data.thumbnail_url,
            language: data.language,
            url: data.url
        });
    }
}
