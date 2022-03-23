function openNotificationsTab() {
    populateNotifications();
}

function populateNotifications() {
    isDisconnected(result => {
        if (!result) {
            chrome.storage.local.get("lastFollowedChannelsRefresh", lastFollowedChannelsRefresh_result => {
                if (lastFollowedChannelsRefresh_result.lastFollowedChannelsRefresh < (Date.now() - 1800000)) {
                    chrome.storage.sync.get("ttvToken", ttvToken_result => {
                        chrome.storage.local.get("ttvUser", ttvUser_result => {
                            getFollowedChannels(
                                ttvToken_result.ttvToken,
                                ttvUser_result.ttvUser.user_id,
                                ttvUser_result.ttvUser.client_id,
                                data => {
                                    chrome.storage.local.set({"lastFollowedChannelsRefresh": Date.now()});
                                    chrome.storage.local.set({"followedChannels": normalizeFollowedChannels(data)}, () => {
                                        chrome.storage.local.get("followedChannels", followedChannels_result => {
                                            addNotifChannels(followedChannels_result.followedChannels);
                                        });
                                    });
                                },
                                null);
                        });
                    });
                } else {
                    chrome.storage.local.get("followedChannels", followedChannels_result => {
                        addNotifChannels(followedChannels_result.followedChannels);
                    });
                }
            });
        } else {
            switchTab("followed-streams-button");
        }
    })
}

function addNotifChannels(followedChannels) {
    chrome.storage.sync.get("notified-streams", notifieds_result => {
        this.document.getElementById("notifications").innerHTML = "";
        followedChannels.forEach(element => {
            this.document.getElementById("notifications").innerHTML += newStreamElement(element, notifieds_result["notified-streams"]);
        });
        followedChannels.forEach(element => {
            this.document.getElementById("notif-checkbox-" + element.login).onchange = function(el) {
                if (el.target.checked)
                    addToNotified(element.login);
                else
                    removeFromNotified(element.login);
            };
        });
    })
}

function addToNotified(login) {
    chrome.storage.sync.get("notified-streams", notifieds_result => {
        var notifieds = notifieds_result["notified-streams"];
        if (notifieds == null)
            notifieds = [];
        notifieds.push(login);
        chrome.storage.sync.set({"notified-streams": notifieds});
    });
}

function removeFromNotified(login) {
    chrome.storage.sync.get("notified-streams", notifieds_result => {
        var notifieds = notifieds_result["notified-streams"];
        if (notifieds == null)
            notifieds = [];
        if (notifieds.includes(login)) {
            notifieds.splice(notifieds.indexOf(login), 1);
            chrome.storage.sync.set({"notified-streams": notifieds});
        }
    });
}

function newStreamElement(stream_info, notified_streams){
    var newStream = 
        '<div class="notification">' +
        '	<a href="https://twitch.tv/' + stream_info.login + '" target="_blank"><div class="streamer-name" title="Go to twitch.tv/' + stream_info.login + '">' + sanitizeString(stream_info.name) + ' &#8599;	</div></a>' +
        '	<div class="followed-date">Followed since<br />' + getFollowedTime(stream_info.date) + '</div>' +
        '   <div class="notif-text">' +
        '	   Enable Notifications' +
        '	   <label class="enable-notifications switch">' +
        '		   <input class="checkbox" id="notif-checkbox-' + stream_info.login + '" type=checkbox ' + (hasNotificationsEnabled(notified_streams, stream_info.login) ? 'checked': '') + ' >' +
        '		   <span class="slider"></span>' +
        '		</label>' +
        '	</div>' +
        '</div>'
    return newStream;
}

function getFollowedTime(time) {
    let date = new Date(time);
    return date.toLocaleString("en-US", {month: "long", day: "numeric", year: "numeric"}) + " &#183; " + date.toLocaleTimeString("en-US", {hour12: false}).substring(0, 5);
}

function hasNotificationsEnabled(notified_streams, login) {
    if (notified_streams == null) {
        return false;
    }
    return notified_streams.includes(login);
}