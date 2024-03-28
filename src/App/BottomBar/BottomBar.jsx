import React, {PureComponent} from "react";
import styles from "./BottomBar.module.sass";
import {AppContext} from "../../Contexts";
import Button from "../Button/Button";
import sorting_Descending from "../../assets/images/order-descendant.svg";
import sorting_Ascending from "../../assets/images/order-ascendant.svg";
import ChromeData from '../../ChromeData';

export default class BottomBar extends PureComponent {
    static contextType = AppContext;

    render() {
        return (
            <React.Fragment>
                {this.context.isLoggedIn ?
                    <React.Fragment>
                        <div className={styles.bottomBar}>
                            <Button
                                className={`${styles.tabButton} ${this.context.currentTab === 'livestream' ? styles.selected : ''}`}
                                onClick={() => {
                                    this.context.switchTab('livestream');
                                }}>
                                <div className={styles.selectedTriangle}></div>
                                <div className={styles.infobox}>
                                    <div className={styles.triangle}></div>
                                    Followed Streams
                                </div>
                                <svg type="color-fill-current" width="23px" height="23px" version="1.1"
                                     viewBox="0 0 20 20" x="0px" y="0px" className={styles.svgIcon}>
                                    <g>
                                        <path fillRule="evenodd"
                                              d="M9.171 4.171A4 4 0 006.343 3H6a4 4 0 00-4 4v.343a4 4 0 001.172 2.829L10 17l6.828-6.828A4 4 0 0018 7.343V7a4 4 0 00-4-4h-.343a4 4 0 00-2.829 1.172L10 5l-.829-.829zm.829 10l5.414-5.414A2 2 0 0016 7.343V7a2 2 0 00-2-2h-.343a2 2 0 00-1.414.586L10 7.828 7.757 5.586A2 2 0 006.343 5H6a2 2 0 00-2 2v.343a2 2 0 00.586 1.414L10 14.172z"
                                              clipRule="evenodd"></path>
                                    </g>
                                </svg>
                            </Button>

                            <Button
                                className={`${styles.tabButton} ${this.context.currentTab === 'notifications' ? styles.selected : ''}`}
                                onClick={() => {
                                    this.context.switchTab('notifications');
                                }}>
                                <div className={styles.selectedTriangle}></div>
                                <div className={styles.infobox}>
                                    <div className={styles.triangle}></div>
                                    Stream Notifications
                                </div>
                                <svg width="23px" height="23px" version="1.1" viewBox="0 0 20 20" x="0px" y="0px"
                                     className={styles.svgIcon}>
                                    <g>
                                        <path fillRule="evenodd"
                                              d="M4 3h12l2 4v10H2V7l2-4zm.236 4H8v1a1 1 0 001 1h2a1 1 0 001-1V7h3.764l-1-2H5.236l-1 2zM16 9h-2.17A3.001 3.001 0 0111 11H9a3.001 3.001 0 01-2.83-2H4v6h12V9z"
                                              clipRule="evenodd"></path>
                                    </g>
                                </svg>
                            </Button>

                            <div className={styles.rightButtons}>
                                <Button
                                    className={`${styles.tabButton} ${styles.sorting} ${this.context.sorting === 'descendant' ? styles.selected : ''}`}
                                    onClick={() => this.context.setViewerSorting('descendant')}>
                                    <div className={styles.infobox}>
                                        <div className={styles.triangle}></div>
                                        Sort by viewer count (descending)
                                    </div>
                                    <img
                                        className={styles.sorting}
                                        src={sorting_Descending}
                                        alt="Sort by viewer count (descending)"
                                    />
                                </Button>

                                <Button
                                    className={`${styles.tabButton} ${styles.sorting} ${this.context.sorting === 'ascendant' ? styles.selected : ''}`}
                                    onClick={() => this.context.setViewerSorting('ascendant')}>
                                    <div className={styles.infobox}>
                                        <div className={styles.triangle}></div>
                                        Sort by viewer count (ascending)
                                    </div>
                                    <img
                                        src={sorting_Ascending}
                                        alt="Sort by viewer count (ascending)"
                                    />
                                </Button>
                            </div>
                        </div>
                    </React.Fragment>
                    : null}
            </React.Fragment>
        );
    }
}
