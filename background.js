chrome.alarms.create("refresh", {
    "delayInMinutes": 5,
    "periodInMinutes": 5
});
chrome.alarms.onAlarm.addListener(alarm => {
    refreshToken(true);
})

chrome.runtime.onInstalled.addListener(() => {
    onStart();
});

chrome.runtime.onStartup.addListener(() => {
    onStart();
});

function onStart() {
    initValues();

    chrome.action.setBadgeBackgroundColor({
        "color": [96, 58, 140, 255]
    });

    chrome.storage.local.set({"lastFollowedChannelsRefresh": 1});
    chrome.storage.local.set({"lastTTVTokenRefresh": 1});
    chrome.storage.local.set({"lastStreamsRefresh": 0});
    chrome.storage.local.set({"callUserInfos": true});
    chrome.storage.local.set({"totalRefreshCount": 0}, () => {
        chrome.storage.sync.set({"alreadyNotifiedStreams": []}, () => {
            forceRefresh();
        });
    });
}

function initValues() {
    chrome.storage.sync.get("viewercount-order", value => {
        if (value["viewercount-order"] == null)
            chrome.storage.sync.set({"viewercount-order": "descendant"});
    });
    chrome.storage.sync.get("streams-layout", value => {
        if (value["streams-layout"] == null)
            chrome.storage.sync.set({"streams-layout": "regular"});
    });
    chrome.storage.sync.get("notified-streams", value => {
        if (value["notified-streams"] == null)
            chrome.storage.sync.set({"notified-streams": {}});
    });
}

function refreshToken(refreshAll) {
    /**
     * We validate the ttv token every 1h
     * This also allows to get some values from Twitch
     */
    chrome.storage.sync.get("ttvToken", ttvToken_result => {
        var ttvToken = ttvToken_result.ttvToken;
        if (ttvToken != null && ttvToken != "failed" && ttvToken != "none") {
            chrome.storage.local.get("lastTTVTokenRefresh", lastTTVTokenRefresh_result => {
                if (lastTTVTokenRefresh_result.lastTTVTokenRefresh < (Date.now() - 3600000)) {
                    validateTTVToken(ttvToken, data => {
                        if (data == null) {
                            hardDisconnect();
                        } else {
                            chrome.storage.local.remove("disconnected");
                            let ttvUser = {
                                "client_id": data.client_id,
                                "expires_in": data.expires_in,
                                "login": data.login,
                                "user_id": data.user_id
                            };
                            chrome.storage.local.set({"ttvUser": ttvUser});
                            if (refreshAll)
                                refresh(ttvToken, ttvUser);
                        }
                    });
                } else if (refreshAll) {
                    chrome.storage.local.get("ttvUser", ttvUser_result => {
                        refresh(ttvToken, ttvUser_result.ttvUser);
                    });
                }
            });
        }
    });
}

function refresh(ttvToken, ttvUser) {
    chrome.storage.local.get("callUserInfos", callUserInfos_result => {
        if (callUserInfos_result.callUserInfos) {
            chrome.storage.local.set({"callUserInfos": false});
            getUserInfos(ttvToken, ttvUser.client_id, data => {
                chrome.storage.local.set({"ttvUser_data": data.data[0]});
            });
        } else {
            chrome.storage.local.set({"callUserInfos": true});
        }
    });

    getLiveFollowedStreams(ttvToken, ttvUser.user_id, ttvUser.client_id, data => {
        chrome.storage.local.set({"lastStreamsRefresh": Date.now()});
        chrome.storage.local.set({"ttvStreams_data": data.data});
        chrome.action.setBadgeText({
            "text": data.data.length.toString()
        });

        var allStreams = [];
        data.data.forEach(el => {
            allStreams.push(el["user_login"]);
        })
        
        chrome.storage.local.get("totalRefreshCount", (totalRefreshCount_result) => {
            if (totalRefreshCount_result.totalRefreshCount != 0) {
                chrome.storage.local.get("alreadyNotifiedStreams", (alreadyNotifiedStreams_result) => {
                    let alreadyNotifiedStreams = alreadyNotifiedStreams_result.alreadyNotifiedStreams;
                    let newStreams =  allStreams;
                    if (alreadyNotifiedStreams != null) {
                        newStreams = allStreams.filter(x => !alreadyNotifiedStreams.includes(x))
                    }
                    newNotification(newStreams);
                    chrome.storage.sync.set({"alreadyNotifiedStreams": newStreams});
                });
            } else {
                chrome.storage.sync.set({"alreadyNotifiedStreams": allStreams});
            }
        });
    });
}

function newNotification(streamers) {
    var streamersFormatted = "";
    streamers.forEach(el => {
        streamersFormatted += el + ", ";
    });
    streamersFormatted = streamersFormatted.substring(0, streamersFormatted.length - 2);

    chrome.notifications.create(
        "ttvrightnow",
        {
            "buttons": [
            ],
            "title": "These streamers started streaming",
            "message": streamersFormatted,
            "type": "basic",
            "contextMessage": "Twitch Right Now",
            "iconUrl": "images/icon.png"
        },
        notifId => {
            console.log("clicked");
        }
    )
}

function forceRefresh() {
    chrome.storage.local.set({"lastTTVTokenRefresh": 0}, () => {
        chrome.storage.local.set({"callUserInfos": true}, () => {
            refreshToken(true);
        });
    });
}

function disconnect() {
    chrome.storage.sync.remove("ttvToken");
    chrome.storage.local.remove("ttvStreams_data");
    chrome.storage.local.remove("ttvUser_data");
    chrome.storage.local.remove("ttvUser");
    chrome.action.setBadgeText({
        "text": ""
    });
}

chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {
        if (sender.origin === "https://klemms.github.io") {
            if (request.requestType == "setTtvToken") {
                if (request.ttvToken != "none") {
                    chrome.storage.sync.set({"ttvToken": request.ttvToken}, () => {
                        console.log("Successfully set token to : " + request.ttvToken);
                        forceRefresh();
                    });
                    sendResponse({status: "success"});
                } else {
                    console.log("TTV Token was none");
                    chrome.storage.sync.set({"ttvToken": "failed"});
                    sendResponse({status: "token_none"});
                }
            } else {
                console.log("Unknown message type");
                sendResponse({status: "unknown_msg"});
            }
        }
    }
);

function validateTTVToken(ttvToken, callback) {
    console.log("CALL validateTTVToken");
    fetch("https://id.twitch.tv/oauth2/validate", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + ttvToken
        }
    }).then(response => {
        chrome.storage.local.set({"lastTTVTokenRefresh": Date.now()});
        response.json().then(data => {
            callback(data);
        })
    }, reason => {
        callback(null);
    });
}

function getLiveFollowedStreams(ttvToken, ttvUserId, clientId, callback) {
    console.log("CALL getLiveFollowedStreams");
    fetch("https://api.twitch.tv/helix/streams/followed?user_id=" + ttvUserId, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + ttvToken,
            "Client-Id": clientId
        }
    }).then(response => {
        response.json().then(data => {
            callback(data);
        })
    }, reason => {
        // TODO: handle this case
        console.log(reason);
    });
}

function getUserInfos(ttvToken, clientId, callback) {
    console.log("CALL getUserInfos");
    fetch("https://api.twitch.tv/helix/users", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + ttvToken,
            "Client-Id": clientId
        }
    }).then(response => {
        response.json().then(data => {
            callback(data);
        })
    }, reason => {
        // TODO: handle this case
        console.log(reason);
    });
}
