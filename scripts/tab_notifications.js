function newStreamElement(stream_info){
    var newStream = 
        '<a href="https://www.twitch.tv/' + stream_info.login + '" target="_blank"><div class="stream">' +
        '   <div class="streamer-name" title="' + sanitizeString(stream_info.name) + '">' + sanitizeString(stream_info.name) + '</div>' +
        '   <div class="followed-date">' + getStreamUptime(stream_info.date) + '</div>' +
        '   <div class="notif-text"><input class="enable-notifications" type=checkbox />Enable Notifications ?</div>' +
        '</div></a>';
    
    return newStream;
}