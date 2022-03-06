var refreshID;
var callUserInfos;

chrome.runtime.onInstalled.addListener(() => {
    console.log("Extention installed");
    onStart();
});

chrome.runtime.onStartup.addListener(
    function() {
        console.log("Browser started");
        onStart();
    }
);

function onStart() {
    chrome.action.setBadgeBackgroundColor({
        "color": [96, 58, 140, 255]
    });
    chrome.storage.local.set({"lastTTVTokenRefresh": 1});
    forceRefresh();
}

function refreshToken(startLoop) {
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
                            refresh(ttvToken, ttvUser);
                        }
                    });
                } else {
                    chrome.storage.local.get("ttvUser", ttvUser_result => {
                        refresh(ttvToken, ttvUser_result.ttvUser);
                    });
                }
            });
        }
    });

    if (startLoop) {
        // Refreshing every 5 mins
        refreshID = setTimeout(function() {
            refreshToken(true);
        }, 300000);
    }
}

function refresh(ttvToken, ttvUser) {
    if (callUserInfos) {
        getUserInfos(ttvToken, ttvUser.client_id, data => {
            chrome.storage.local.set({"ttvUser_data": data.data[0]});
        });
    }

    getLiveFollowedStreams(ttvToken, ttvUser.user_id, ttvUser.client_id, data => {
        chrome.storage.local.set({"ttvStreams_data": data.data});
        chrome.action.setBadgeText({
            "text": data.data.length.toString()
        });
    });
}

function forceRefresh() {
    chrome.storage.local.set({"lastTTVTokenRefresh": 0}, () => {
        callUserInfos = true;
        clearTimeout(refreshID);
        refreshToken(true);
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
                        console.log("successfully set token to : " + request.ttvToken);
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
