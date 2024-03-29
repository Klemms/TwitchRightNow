import React from "react";

export const defaultAppContextValue = () => {
    return {
        isLoggedIn: false,
        username: 'Twitch User',
        userPicture: 'https://static-cdn.jtvnw.net/jtv_user_pictures/599b546a-c27f-4684-93ff-5eeecd01fb2b-profile_image-300x300.png',
        currentTab: 'livestream',
        lastUpdate: Date.now(),
        livestreams: [],
        followedChannels: [],
        fetchedChannels: false,
        currentSearch: '',
        sorting: 'descendant',
        showFavorites: true
    }
};
export const AppContext = React.createContext(defaultAppContextValue());
