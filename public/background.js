chrome.alarms.create("refresh", {
	"delayInMinutes": 1,
	"periodInMinutes": 1
});
chrome.alarms.onAlarm.addListener(alarm => {
	refreshToken(true).then(() => {}, () => {});
})

chrome.runtime.onInstalled.addListener(() => {
	onStart();
});

chrome.runtime.onStartup.addListener(() => {
	onStart();
});

chrome.notifications.onButtonClicked.addListener((notificationId) => {
	if (notificationId === 'ttvrightnow') {
		chrome.storage.local.get('lastStreamerNotification').then(value => {
			chrome.notifications.clear('ttvrightnow');
			chrome.tabs.create({
				url: `https://www.twitch.tv/${value.lastStreamerNotification.user_login}`
			});
		});
	}
})

/**
 * Communication with the token retrieval page
 */
chrome.runtime.onMessageExternal.addListener(
	function (request, sender, sendResponse) {
		if (sender.origin === "https://klemms.github.io") {
			if (request.requestType === "setTtvToken") {
				if (request.ttvToken !== "none") {
					chrome.storage.sync.set({"ttvToken": request.ttvToken}).then(() => {
						console.log("Successfully set token to : " + request.ttvToken);
						sendResponse({status: "success"});
						onStart();
					});
				} else {
					console.log("TTV Token was none");
					chrome.storage.sync.set({"ttvToken": "failed"}).then(() => {
						sendResponse({status: "token_none"});
					});
				}
			} else {
				console.log("Unknown message type");
				sendResponse({status: "unknown_msg"});
			}
		}
	}
);

chrome.runtime.onMessage.addListener((message, sender) => {
	if (sender.id === chrome.runtime.id && message.reason) {
		switch (message.reason) {
			case 'disconnect':
				disconnect(true, 'You can reconnect anytime using the "Log in with Twitch" button');
				break;
			case 'get-followed-channels':
				chrome.storage.sync.get('ttvToken').then(value => {
					chrome.storage.local.get(['ttvUser', 'lastFollowedChannelsRefresh']).then(value1 => {
						if (!value.ttvToken || !value1.ttvUser) {
							return;
						}

						if (value1.lastFollowedChannelsRefresh > (Date.now() - 1800000)) {
							sendUIUpdate('followed-channels-update');
							return;
						}

						getFollowedChannels(value.ttvToken, value1.ttvUser.user_id, value1.ttvUser.client_id, null).then(result => {
							chrome.storage.local.set({
								lastFollowedChannelsRefresh: Date.now(),
								followedChannels: normalizeFollowedChannels(result)
							}).then(() => {
								sendUIUpdate('followed-channels-update');
							});
						});
					})
				})
				break;
		}
	}
});

function onStart() {
	initValues().then(() => {
		chrome.action.setBadgeBackgroundColor({
			"color": [96, 58, 140, 255]
		});

		chrome.storage.local.set({
			lastFollowedChannelsRefresh: 1,
			lastTTVTokenRefresh: 1,
			lastStreamsRefresh: 0,
			callUserInfos: true,
			totalRefreshCount: 0,
			alreadyNotifiedStreams: []
		}).then(() => {
			forceRefresh();
		});
	})
}

function initValues() {
	return chrome.storage.sync.get([
		'viewerCountOrder',
		'streamsLayout',
		'notifiedStreams',
		'notifyAllStreams',
		'viewercount-order',
		'streams-layout',
		'notified-streams',
		'notify-all-streams',
		'favoriteStreams'
	]).then((value) => {
		return chrome.storage.sync.set({
			viewerCountOrder: value.viewerCountOrder || value['viewercount-order'] || 'descendant',
			streamsLayout: value.streamsLayout || value['streams-layout'] || 'regular',
			notifiedStreams: value.notifiedStreams || value['notified-streams'] || [],
			notifyAllStreams: value.notifyAllStreams || value['notify-all-streams'] || false,
			favoriteStreams: value.favoriteStreams || []
		});
	})
}

function disconnect(hard, notificationMessage) {
	return chrome.storage.local.clear().then(() => {
		return chrome.storage.sync.clear().then(() => {
			sendUIUpdate('logstate');
			if (notificationMessage) {
				chrome.notifications.create(
					"ttvrightnow",
					{
						title: "TTV Right Now has been disconnected from Twitch",
						message: notificationMessage,
						type: "basic",
						contextMessage: "TTV Right Now",
						iconUrl: "images/icon.png"
					}
				);
			}
		})
	})
}

function forceRefresh() {
	chrome.storage.local.set({
		lastTTVTokenRefresh: 0,
		callUserInfos: true
	}).then(() => {
		refreshToken(true).then(value => {

		}, error => {
			console.warn("Couldn't refresh :", error);
		})
	})
}

/**
 *
 * @param refreshAll
 * @param tryCount
 * @returns {Promise<{[p: string]: any}>}
 */
function refreshToken(refreshAll, tryCount = 0) {
	return chrome.storage.sync.get('ttvToken').then(value => {
		if (!value.ttvToken) {
			disconnect(true);
			return Promise.reject('no-ttv-token');
		}
		let ttvToken = value.ttvToken;

		if (ttvToken !== 'failed' && ttvToken !== 'none') {
			chrome.storage.local.get('lastTTVTokenRefresh').then(value => {
				let lastTTVTokenRefresh = value.lastTTVTokenRefresh || 0;

				if (lastTTVTokenRefresh < (Date.now() - 3600000)) {
					validateTTVToken(ttvToken).then(data => {
						if (data == null) {
							return Promise.reject('server-error')
						}

						let ttvUser = {
							"client_id": data.client_id,
							"expires_in": data.expires_in,
							"login": data.login,
							"user_id": data.user_id
						};

						return chrome.storage.local.set({
							isLoggedIn: true,
							ttvUser: ttvUser
						}).then(() => {
							sendUIUpdate('logstate');
							if (refreshAll) {
								return refresh(ttvToken, ttvUser);
							}
						});
					}, () => {
						if (tryCount < 3) {
							console.log('Error, retrying in 5s', tryCount);
							return new Promise((resolve) => {
								setTimeout(() => {
									resolve(refreshToken(refreshAll, tryCount + 1));
								}, 5000);
							});
						}
						return Promise.reject('server-error');
					})
				} else if (refreshAll) {
					chrome.storage.local.get('ttvUser').then(value1 => {
						if (!value1.ttvUser) {
							return chrome.storage.local.set({lastTTVTokenRefresh: 0}).then(() => {
								return refreshToken(refreshAll);
							});
						}

						return refresh(ttvToken, value1.ttvUser);
					})
				}
			})
		} else {
			disconnect(true, 'Your Twitch Auth is no longer valid, please log back in using your Twitch account');
			return Promise.reject('invalid-token');
		}
	});
}

function refresh(ttvToken, ttvUser) {
	chrome.storage.local.get(['callUserInfos', 'ttvUserData']).then(value => {
		if (!!value.callUserInfos || !value.ttvUserData) {
			chrome.storage.local.set({callUserInfos: false}).then(() => {
				getTTVUserInfos(ttvToken, ttvUser.client_id).then(value => {
					chrome.storage.local.set({
						ttvUserData: {
							createdAt: value.created_at,
							displayName: value.display_name,
							id: value.id,
							login: value.login,
							offlineImageURL: value.offline_image_url,
							profilePicture: value.profile_image_url
						}
					}).then(() => {
						sendUIUpdate('user-infos');
					});
				}, error => {
					console.warn("Couldn't get user infos :", error);
				});
			});
		} else {
			chrome.storage.local.set({callUserInfos: true});
		}
	});

	getLiveFollowedStreams(ttvToken, ttvUser.user_id, ttvUser.client_id).then(value => {
		let data = value.data;

		return chrome.storage.sync.get('favoriteStreams').then(value => {
			const favorites = value.favoriteStreams || [];

			return chrome.storage.local.set({
				lastStreamsRefresh: Date.now(),
				ttvStreamsData: data.map(el => {
					return {
						...el,
						isFavorite: favorites.includes(el.user_login)
					}
				})
			});
		}).then(() => {
			if (data) {
				chrome.action.setBadgeBackgroundColor({
					"color": [96, 58, 140, 255]
				});
				chrome.action.setBadgeText({
					'text': data.length.toString()
				});
			}

			sendUIUpdate('livestreams-update');

			let allStreams = data.map(element => {
				return element.user_login;
			});

			return chrome.storage.sync.get([
				'notifiedStreams',
				'notifyAllStreams'
			]).then(value => {
				return chrome.storage.local.get(['totalRefreshCount', 'alreadyNotifiedStreams']).then(value1 => {
					return chrome.storage.local.set({totalRefreshCount: value1.totalRefreshCount + 1}).then(() => {
						if (value1.totalRefreshCount !== 0) {
							let notifiedStreams =  [];
							let newStreams = allStreams;
							let stoppedStreams =  [];

							newStreams = allStreams.filter(x => !value1.alreadyNotifiedStreams.includes(x))
							stoppedStreams = value1.alreadyNotifiedStreams.filter(x => !allStreams.includes(x))
							notifiedStreams = allStreams.filter(x => !stoppedStreams.includes(x))

							// If "enable all notifications" checkbox isnt checked, we filter out streams
							if (!value.notifyAllStreams) {
								newStreams = newStreams.filter(x => value.notifiedStreams.includes(x))
							}

							if (newStreams.length > 0) {
								newNotification(data.filter((x) => {
									return newStreams.includes(x.user_login);
								}));
							}

							return chrome.storage.local.set({alreadyNotifiedStreams: notifiedStreams});
						} else {
							return chrome.storage.local.set({alreadyNotifiedStreams: allStreams});
						}
					});
				});
			});
		});
	});

	return Promise.resolve();
}

function newNotification(streamers) {
	let streamersFormatted = "";
	streamers.forEach(el => {
		streamersFormatted += (el.user_name === '' ? el.user_login : el.user_name) + ", ";
	});
	streamersFormatted = streamersFormatted.substring(0, streamersFormatted.length - 2);

	let title = "These streamers started streaming";
	switch(streamers.length) {
		case 1:
			title = `${(streamers[0].user_name === '' ? streamers[0].user_login : streamers[0].user_name)} started streaming ${streamers[0].game_name}`;
			streamersFormatted = streamers[0].title || streamers[0].game_name || "";
			break;
		case 2:
			title = (streamers[0].user_name === '' ? streamers[0].user_login : streamers[0].user_name) + " and " + (streamers[1].user_name === '' ? streamers[1].user_login : streamers[1].user_name) + " started streaming !";
			break;
	}

	let goToButtons = [];
	if (streamers.length === 1) {
		goToButtons.push({
			title: `Go to ${(streamers[0].user_name === '' ? streamers[0].user_login : streamers[0].user_name)}'s channel`
		});
	}

	console.log('notif?', notif);

	chrome.storage.local.set({lastStreamerNotification: streamers[0]}).then(() => {
		chrome.notifications.create(
			"ttvrightnow",
			{
				buttons: goToButtons,
				title: title,
				message: streamersFormatted,
				type: "basic",
				contextMessage: "TTV Right Now",
				iconUrl: streamers.length === 1 ? streamers[0].thumbnail_url.replace('{width}', '160').replace('{height}', '90') : "images/icon.png"
			}
		);
	});
}

function sendUIUpdate(state) {
	chrome.runtime.sendMessage({
		reason: state
	}).then(value => {

	}, error => {

	});
}

/**
 * Validates the TTV Token
 * @param ttvToken
 * @returns {Promise<any>}
 */
function validateTTVToken(ttvToken) {
	console.log("CALL validateTTVToken");

	return fetch("https://id.twitch.tv/oauth2/validate", {
		method: "GET",
		headers: {
			"Authorization": "Bearer " + ttvToken
		}
	}).then(response => {
		return chrome.storage.local.set({lastTTVTokenRefresh: Date.now()}).then(() => {
			return response.json();
		});
	}, error => {
		console.warn("Couldn't validate TTV Token", error);
		return error;
	});
}

/**
 * Fetches own User Infos
 * @param ttvToken
 * @param clientId
 * @returns {Promise<any>}
 */
function getTTVUserInfos(ttvToken, clientId) {
	console.log("CALL getTTVUserInfos");

	return fetch("https://api.twitch.tv/helix/users", {
		method: "GET",
		headers: {
			"Authorization": "Bearer " + ttvToken,
			"Client-Id": clientId
		}
	}).then(response => {
		if (response.status === 200) {
			return response.json().then(value => {
				return value.data[0];
			});
		} else if (response.status === 401) {
			disconnect(true, 'Your Twitch Auth is no longer valid, please log back in using your Twitch account');
			return Promise.reject(response);
		}
	}, error => {
		console.warn("Couldn't get UserInfos", error);
		return error;
	});
}

/**
 * Limited to first 100 results
 * @param ttvToken
 * @param ttvUserId
 * @param clientId
 * @param callback
 * @returns {Promise<any>}
 */
function getLiveFollowedStreams(ttvToken, ttvUserId, clientId) {
	console.log("CALL getLiveFollowedStreams");

	return fetch("https://api.twitch.tv/helix/streams/followed?user_id=" + ttvUserId, {
		method: "GET",
		headers: {
			"Authorization": "Bearer " + ttvToken,
			"Client-Id": clientId
		}
	}).then(response => {
		return response.json();
	}, error => {
		console.warn("Couldn't get Live Followed Streams", error);
		return error;
	});
}

function getFollowedChannels(ttvToken, ttvUserId, clientId, page) {
	console.log("CALL getFollowedChannels");

	return fetch("https://api.twitch.tv/helix/channels/followed?first=100&user_id=" + ttvUserId + (page != null ? "&after=" + page : ""), {
		method: "GET",
		headers: {
			"Authorization": "Bearer " + ttvToken,
			"Client-Id": clientId
		}
	}).then(response => {
		return response.json().then(data => {
			let totalData = [];
			if (data.pagination != null && Object.keys(data.pagination).length !== 0 && data.total > 100) {
				totalData = [
					...totalData,
					...data.data
				];

				return getFollowedChannels(ttvToken, ttvUserId, clientId, data.pagination.cursor).then(value => {
					totalData = [
						...totalData,
						...value
					];

					return totalData;
				});
			} else {
				totalData = [
					...totalData,
					...data.data
				];
				return totalData;
			}
		})
	}, error => {
		console.warn("Couldn't get followed channels", error);
		return error;
	});
}

/**
 *
 * @param {*} data Data to normalize
 * @returns Returns alphabetically sorted normalized data array
 */
function normalizeFollowedChannels(data) {
	return data.map((value, index) => {
		return {
			"id": value.broadcaster_id,
			"name": value.broadcaster_name,
			"login": value.broadcaster_login,
			"date": value.followed_at
		};
	}).sort((a, b) => {
		return a.name.localeCompare(b.name);
	});
}
