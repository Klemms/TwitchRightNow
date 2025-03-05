import {TwitchAPI} from "./service_data/twitch_api.js";
import {ChromeData} from "./service_data/chrome_data.js";

const CONFIG_LOCAL_VERSION = 2;
const CONFIG_SYNC_VERSION = 2;

chrome.runtime.onInstalled.addListener(() => {
    return initExtension();
});
chrome.runtime.onStartup.addListener(() => {
    return initExtension();
});

chrome.alarms.create('streams-refresh', {
    'delayInMinutes': 1,
    'periodInMinutes': 1
});

chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm.name === 'streams-refresh') {

    }
});

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
    if (sender.origin === 'https://klemms.github.io') {
        if (request?.requestType === 'setTtvToken') {
            if (request.ttvToken && request.ttvToken !== 'none') {
                TwitchAPI.validateTwitchToken(request.ttvToken)
                    .then(() => {
                        return ChromeData.setTwitchData({
                            token: request.ttvToken,
                        }).then(() => TwitchAPI.updateUserData());
                    })
                    .then(resp => {
                        sendResponse({status: 'success'});
                    })
                    .catch(err => {
                        console.log('Invalid TTV Token');
                        sendResponse({status: 'Invalid Twitch Token'});
                    });
            } else {
                console.log('Invalid TTV Token');
                sendResponse({status: 'Empty Twitch Token'});
            }
        }
    }
});

async function initExtension() {
    const lastLocalVersion = (await chrome.storage.local.get(['ttvLastVersion']))['ttvLastVersion'];
    const lastSyncVersion = (await chrome.storage.sync.get(['ttvLastVersion']))['ttvLastVersion'];

    if (typeof lastLocalVersion !== 'number' || lastLocalVersion < CONFIG_LOCAL_VERSION) {
        console.log('Resetting local data...');
        await resetLocalData();
    }

    if (typeof lastSyncVersion !== 'number' || lastSyncVersion < CONFIG_LOCAL_VERSION) {
        console.log('Resetting sync data...');
        await resetSyncData();
    }

    return Promise.all([
        chrome.storage.local.set({ttvLastVersion: CONFIG_LOCAL_VERSION}),
        chrome.storage.sync.set({ttvLastVersion: CONFIG_SYNC_VERSION}),
    ]);
}

async function resetLocalData() {
    await chrome.storage.local.clear();
}

async function resetSyncData() {
    await chrome.storage.sync.clear();
}