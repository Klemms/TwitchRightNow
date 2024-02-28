import React, {Component} from "react";
import styles from './App.module.sass';
import TopBar from "./TopBar/TopBar";
import BottomBar from "./BottomBar/BottomBar";
import Content from "./Content/Content";
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
        return ChromeData.getLivestreams().then(value => {
            return new Promise((resolve) => {
                this.setState(() => {
                    return {
                        livestreams: value.livestreams,
                        lastUpdate: value.lastUpdate
                    };
                }, () => {
                    resolve();
                });
            });
        });
    }

    updateFollowedChannels() {
        return ChromeData.getFollowedChannels().then(value => {
            return new Promise((resolve) => {
                this.setState(() => {
                    return {
                        followedChannels: value.followedChannels,
                        fetchedChannels: true
                    };
                }, () => {
                    resolve();
                });
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
                        })
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
