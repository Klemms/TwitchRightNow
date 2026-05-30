export async function queryGetFollowedLivestreams(): Promise<Array<Livestream>> {
    const {followedLivestreams} = await browser.storage.local.get('followedLivestreams');

    if (Array.isArray(followedLivestreams)) {
        return followedLivestreams;
    }

    return Promise.reject();
}
