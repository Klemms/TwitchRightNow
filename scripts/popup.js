window.addEventListener("load", function() {
    this.document.getElementById("user-infos-top").onclick = function(me) {
        chrome.storage.sync.remove("ttvToken", () => {
            disconnect();
        });
    };
    this.document.getElementById("searchbox").addEventListener("input", val => {
        chrome.storage.local.get("ttvStreams_data", ttvStreams_data_result => {
            let ttvStreams_data = ttvStreams_data_result.ttvStreams_data;
            
            let newStreamData = ttvStreams_data.filter(element => {
                return element.user_name.toLowerCase().includes(this.document.getElementById("searchbox").value.toLowerCase());
            })

            populateStreams(newStreamData);
        });
    });

    populatePage();
});

function disconnect() {
    chrome.storage.sync.remove("ttvToken");
    chrome.storage.local.remove("ttvStreams_data", () => {
        chrome.storage.local.remove("ttvUser_data", () => {
            populatePage();
        });
    });
    chrome.storage.local.remove("ttvUser");
    chrome.action.setBadgeText({
        "text": ""
    });

}

function populatePage() {
    isDisconnected(result => {
        if (!result) {
            this.document.getElementById("login-twitch").style["display"] = "none";
            this.document.getElementById("user-infos-top").style["display"] = "inline-block";
            this.document.getElementById("disconnected-tip").style["display"] = "none";
            this.document.getElementById("disconnected-stream-tip").style["display"] = "none";
            this.document.getElementById("searchbox").style["display"] = "inline-block";

            chrome.storage.local.get("ttvUser_data", ttvUser_data_result => {
                let ttvUser_data = ttvUser_data_result.ttvUser_data;

                // Populating username + user picture
                this.document.getElementById("username-top").innerHTML = ttvUser_data.display_name;
                this.document.getElementById("user-pic-top").src = ttvUser_data.profile_image_url;
            });

            chrome.storage.local.get("ttvStreams_data", ttvStreams_data_result => {
                let ttvStreams_data = ttvStreams_data_result.ttvStreams_data;
        
                populateStreams(ttvStreams_data);
            });
        } else {
            this.document.getElementById("login-twitch").style["display"] = "inline-block";
            this.document.getElementById("user-infos-top").style["display"] = "none";
            this.document.getElementById("disconnected-tip").style["display"] = "inline-block";
            this.document.getElementById("disconnected-stream-tip").style["display"] = "block";
            this.document.getElementById("searchbox").style["display"] = "none";
            this.document.getElementById("streams").innerHTML = "";
        }
    })

    setTimeout(populatePage, 30000);
}

function populateStreams(stream_data) {
    this.document.getElementById("streams").innerHTML = "";
    stream_data.forEach(element => {
        this.document.getElementById("streams").innerHTML += newDiv(element);
    });
}

function isDisconnected(callback) {
    chrome.storage.local.get("disconnected", disconnected_result => {
        if (disconnected_result.disconnected != null) {
            callback(true);
            return;
        }
        chrome.storage.sync.get("ttvToken", ttvToken_result => {
            if (ttvToken_result.ttvToken == null || ttvToken_result.ttvToken == "failed" || ttvToken_result.ttvToken == "none") {
                callback(true);
                return;
            }
            callback(false);
        });
    });
}

function newDiv(stream_info){
    var newStream = 
        '<a href="https://www.twitch.tv/' + stream_info.user_login + '" target="_blank"><div class="stream">' +
        '<img class="stream-pic" src="' + stream_info.thumbnail_url.replace("{width}", "128").replace("{height}", "72") + '" />' +
        '<div class="streamer-name" title="' + stream_info.user_name + '">' + stream_info.user_name + '</div>' +
        '<div class="right-part">' +
        '    <div class="stream-title" title="' + stream_info.title + '">' + stream_info.title + '</div>' +
        '    <div class="stream-game" title="' + stream_info.game_name + '">' + stream_info.game_name + '</div>' +
        '    <div class="viewer-count">&#x1F534;' + new Intl.NumberFormat('fr-FR').format(stream_info.viewer_count) + '</div>' +
        '    <div class="stream-tags">' +
        '        <div class="stream-time">' + getStreamUptime(stream_info.started_at) + '</div>' +
        '        <div class="stream-language">' + stream_info.language + '</div>' + (stream_info.is_mature ?
        '        <div class="stream-mature">18+</div>':'') +
        '    </div>' +
        '</div>' +
        '</div></a>';
    
    return newStream;
}

function getStreamUptime(startTime) {
    let start = new Date(startTime);
    let now = new Date();
    let hours = (((now - start) / 1000) / 60) / 60;
    let minutes = (((now - start) / 1000) / 60) % 60;

    return parseInt(hours) + ":" + parseInt(minutes).toString().padStart(2, '0');
}