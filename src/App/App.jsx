import React, {Component} from "react";
import styles from './App.module.sass';
import TopBar from "./components/TopBar";
import BottomBar from "./components/BottomBar";
import Content from "./Content";
import ChromeData from "../ChromeData";
import {AppContext, defaultAppContextValue} from "../Contexts";

export default class App extends Component {
    state = {
        ...defaultAppContextValue()
    }

    updateLogState() {
        return ChromeData.isLoggedIn().then(value => {
            return new Promise((resolve) => {
                this.setState(() => {
                    return {
                        isLoggedIn: value
                    };
                }, () => {
                    resolve();
                });
            });
        });
    }

    updateUserInfos() {
        return ChromeData.getUserInfos().then(value => {
            return new Promise((resolve) => {
                this.setState(() => {
                    return {
                        username: value.displayName,
                        userPicture: value.profilePicture
                    };
                }, () => {
                    resolve();
                });
            });
        });
    }

    updateLivestreams() {
        return ChromeData.getFavorites().then(favorites => {
            return ChromeData.getLivestreams().then(value => {
                if (Array.isArray(value.livestreams)) {
                    return new Promise((resolve) => {
                        this.setState(() => {
                            return {
                                livestreams: value.livestreams.map(el => {
                                    return {
                                        ...el,
                                        isFavorite: favorites.includes(el.user_login)
                                    }
                                }),
                                lastUpdate: value.lastUpdate
                            };
                        }, () => {
                            resolve();
                        });
                    });
                }
                return Promise.resolve();
            });
        });
    }

    updateFollowedChannels() {
        return ChromeData.getFavorites().then(favorites => {
            return ChromeData.getFollowedChannels().then(value => {
                if (Array.isArray(value.followedChannels)) {
                    return new Promise((resolve) => {
                        this.setState(() => {
                            return {
                                followedChannels: value.followedChannels.map(el => {
                                    return {
                                        ...el,
                                        isFavorite: favorites.includes(el.login)
                                    }
                                }),
                                fetchedChannels: true
                            };
                        }, () => {
                            resolve();
                        });
                    });
                }
                return Promise.resolve();
            });
        });
    }

    componentDidMount() {
        chrome.runtime.onMessage.addListener((message, sender) => {
            if (sender.id === chrome.runtime.id && message.reason) {
                switch (message.reason) {
                    case 'logstate':
                        this.updateLogState();
                        break;
                    case 'user-infos':
                        this.updateUserInfos();
                        break;
                    case 'livestreams-update':
                        this.updateLivestreams();
                        break;
                    case 'followed-channels-update':
                        this.updateFollowedChannels();
                        break;
                }
            }
        });

        ChromeData.pastBroadcastsFeature().then(value => {
            this.setState({
                pastBroadcastsFeature: value
            });
        });

        ChromeData.showFavorites().then(value => {
            this.setState({
                showFavorites: value
            });
        });

        ChromeData.getSorting().then(value => {
            if (value === 'descendant' || value === 'ascendant') {
                this.setState({
                    sorting: value
                });
            }
        });

        this.updateLogState().then(value => {
            if (this.state.isLoggedIn) {
                this.updateUserInfos();
                this.updateLivestreams();
            }
        });
    }

    render() {
        return (
            <div className={styles.appBody}>
                <AppContext.Provider value={{
                    ...this.state,
                    switchTab: tabName => {
                        this.setState(() => {
                            return {
                                currentTab: tabName
                            };
                        });
                    },
                    setCurrentSearch: text => {
                        this.setState(() => {
                            return {
                                currentSearch: text
                            };
                        });
                    },
                    setViewerSorting: sorting => {
                        return ChromeData.setSorting(sorting).then(() => {
                            this.setState({
                                sorting: sorting
                            });
                        });
                    },
                    setShowFavorites: showFavorites => {
                        return ChromeData.showFavorites(showFavorites).then(() => {
                            this.setState({
                                showFavorites: showFavorites
                            });
                        });
                    },
                    setPastBroadcastsFeature: pastBroadcastState => {
                        return ChromeData.pastBroadcastsFeature(pastBroadcastState).then(() => {
                            this.setState({
                                pastBroadcastsFeature: pastBroadcastState
                            });
                        });
                    },
                    update: () => {
                        this.updateLivestreams();
                        this.updateFollowedChannels();
                    }
                }}>
                    <Content/>
                    <TopBar/>
                    <BottomBar/>
                </AppContext.Provider>
            </div>
        );
    }

}
