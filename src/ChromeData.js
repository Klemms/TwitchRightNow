export default {
	isLoggedIn: () => {
		return chrome.storage.local.get('isLoggedIn').then(value => {
			return !!value.isLoggedIn;
		});
	},
	getUserInfos: () => {
		return chrome.storage.local.get('ttvUserData').then(value => {
			return value.ttvUserData;
		});
	},
	notifyStream: (streamerLogin, notify) => {
		return chrome.storage.sync.get(['notifiedStreams']).then(value => {
			let notifiedStreams = value.notifiedStreams || [];

			if (notify) {
				notifiedStreams.push(streamerLogin);
			} else {
				let streamIndex = notifiedStreams.indexOf(streamerLogin);

				if (streamIndex >= 0) {
					notifiedStreams.splice(streamIndex, 1);
				}
			}

			return chrome.storage.sync.set({
				notifiedStreams: notifiedStreams
			});
		});
	},
	notifyAllStreams: notify => {
		return chrome.storage.sync.set({
			notifyAllStreams: notify
		});
	},
	getToNotifyStreams: () => {
		return chrome.storage.sync.get(['notifiedStreams', 'notifyAllStreams']).then(value => {
			return {
				notifyAllStreams: value.notifyAllStreams,
				notifiedStreams: value.notifiedStreams
			};
		});
	},
	getLivestreams: () => {
		return chrome.storage.local.get(['ttvStreamsData', 'lastStreamsRefresh']).then(value => {
			return {
				livestreams: value.ttvStreamsData,
				lastUpdate: value.lastStreamsRefresh
			};
		});
	},
	getFollowedChannels: () => {
		return chrome.storage.local.get(['lastFollowedChannelsRefresh', 'followedChannels']).then(value => {
			return {
				lastFollowedChannelsRefresh: value.lastFollowedChannelsRefresh,
				followedChannels: value.followedChannels
			};
		});
	},
	demandGetFollowedChannels: () => {
		return chrome.runtime.sendMessage({
			reason: 'get-followed-channels'
		});
	},
	disconnect: () => {
		return chrome.runtime.sendMessage({
			reason: 'disconnect'
		});
	}
};
