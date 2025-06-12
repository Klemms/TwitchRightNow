import {Events} from '@/entrypoints/background/events.ts';
import {TwitchAPI} from '@/entrypoints/background/twitch_api.ts';
import {ChromeData} from '@/utils/ChromeData.ts';
import {EventNames} from '@/utils/EventNames.ts';

export default defineBackground({
    type: 'module',

    main() {
        const CONFIG_LOCAL_VERSION = 2;
        const CONFIG_SYNC_VERSION = 2;

        browser.runtime.onInstalled.addListener(() => {
            return initExtension();
        });
        browser.runtime.onStartup.addListener(() => {
            return initExtension();
        });

        browser.alarms.create('streams-refresh', {
            delayInMinutes: 1,
            periodInMinutes: 1,
        });

        browser.alarms.onAlarm.addListener((alarm) => {
            if (alarm.name === 'streams-refresh') {
                refresh();
            }
        });

        browser.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
            if (sender.origin === 'https://klemms.github.io') {
                if (request?.requestType === 'setTtvToken') {
                    if (request.ttvToken && request.ttvToken !== 'none') {
                        TwitchAPI.validateTwitchToken(request.ttvToken)
                            .then(() => {
                                return ChromeData.setTwitchData({
                                    token: request.ttvToken,
                                }).then(() => TwitchAPI.updateUserData());
                            })
                            .then(() => {
                                Events.sendEvent(EventNames.CONNECTED);
                                sendResponse({status: 'success'});
                                return refresh();
                            })
                            .catch((error) => {
                                if (error === Errors.INVALID_TOKEN) {
                                    console.log('Invalid TTV Token');
                                    sendResponse({status: 'Invalid Twitch Token'});
                                } else {
                                    console.log('Server error');
                                    sendResponse({status: "An error occurred while contacting Twitch's servers"});
                                }
                            });
                    } else {
                        console.log('Empty TTV Token');
                        sendResponse({status: 'Empty Twitch Token'});
                    }
                }
            }
        });

        ChromeData.updateBadge();

        async function initExtension() {
            const lastLocalVersion = (await browser.storage.local.get(['ttvLastVersion']))['ttvLastVersion'];
            const lastSyncVersion = (await browser.storage.sync.get(['ttvLastVersion']))['ttvLastVersion'];

            if (typeof lastLocalVersion !== 'number' || lastLocalVersion < CONFIG_LOCAL_VERSION) {
                console.log('Resetting local data...');
                await resetLocalData();
            }

            if (typeof lastSyncVersion !== 'number' || lastSyncVersion < CONFIG_LOCAL_VERSION) {
                console.log('Resetting sync data...');
                await resetSyncData();
            }

            return Promise.all([
                browser.storage.local.set({ttvLastVersion: CONFIG_LOCAL_VERSION}),
                browser.storage.sync.set({ttvLastVersion: CONFIG_SYNC_VERSION}),
            ]).finally(() => {
                refresh();
            });
        }

        function refresh() {
            browser.storage.sync.get('twitch').then((res) => {
                if (res.twitch) {
                    refreshToken()
                        .then(() => TwitchAPI.updateFollowedLiveStreams())
                        .catch((e) => console.info('Twitch API responded with error :', e));
                }
            });
        }

        async function resetLocalData() {
            await browser.storage.local.clear();
        }

        async function resetSyncData() {
            await browser.storage.sync.clear();
        }

        async function refreshToken() {
            const lastRefresh = (await browser.storage.local.get('twitchTokenLastRefresh'))['twitchTokenLastRefresh'];

            if (Date.now() - lastRefresh >= 3_600_000) {
                return TwitchAPI.validateTwitchToken();
            }
        }
    },
});
