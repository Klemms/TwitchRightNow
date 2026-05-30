import {TwitchAPI} from '@/entrypoints/background/twitch_api.ts';

//const SchemaFollowedBroadcasters = z.array(SchemaBroadcaster).default([]);

export async function queryGetFollowedChannels() {
    // For now always request fresh data
    return TwitchAPI.updateFollowedChannels();

    /*return browser.storage.sync
        .get('followedBroadcasters')
        .then((val) => SchemaFollowedBroadcasters.parseAsync(val['followedBroadcasters']));*/
}
