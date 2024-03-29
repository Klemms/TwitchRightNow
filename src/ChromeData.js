export default {
	getRawData: (dataName = '', isSync = true) => {
		if (dataName.length === 0) {
			return Promise.reject('Empty data name string !');
		}

		const storage = isSync ? chrome.storage.sync : chrome.storage.local;
		return storage.get(dataName).then(value => {
			return value[dataName] || null;
		});
	},
	setRawData: (dataName = '', value, isSync = true) => {
		if (dataName.length === 0) {
			return Promise.reject('Empty data name string !');
		}

		const storage = isSync ? chrome.storage.sync : chrome.storage.local;
		return storage.set({
			[dataName]: value
		});
	},
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
	getSorting: () => {
		return chrome.storage.sync.get('viewerCountOrder').then(value => {
			return value.viewerCountOrder || 'descendant';
		});
	},
	setSorting: sorting => {
		return chrome.storage.sync.set({
			viewerCountOrder: sorting
		});
	},
	getFavorites: () => {
		return chrome.storage.sync.get('favoriteStreams').then(value => {
			return value.favoriteStreams || [];
		});
	},
	showFavorites: (showFavorites) => {
		if (showFavorites === true || showFavorites === false) {
			return chrome.storage.sync.set({
				showFavorites: showFavorites
			});
		}

		return chrome.storage.sync.get('showFavorites').then(value => {
			return typeof value.showFavorites === 'boolean' ? value.showFavorites : true;
		});
	},
	addFavorite: streamerLogin => {
		return chrome.storage.sync.get('favoriteStreams').then(value => {
			const favorites = value.favoriteStreams || [];

			if (favorites.includes(streamerLogin)) {
				return Promise.resolve();
			}

			favorites.push(streamerLogin);

			return chrome.storage.sync.set({
				favoriteStreams: favorites
			});
		});
	},
	removeFavorite: streamerLogin => {
		return chrome.storage.sync.get('favoriteStreams').then(value => {
			const favorites = value.favoriteStreams || [];

			if (favorites.includes(streamerLogin)) {
				favorites.splice(favorites.indexOf(streamerLogin), 1);

				return chrome.storage.sync.set({
					favoriteStreams: favorites
				});
			}

			return Promise.resolve();
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
