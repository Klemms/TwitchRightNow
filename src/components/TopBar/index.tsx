import {Button} from '@/components/Button';
import {ContextMenu} from '@/components/ContextMenu';
import {MenuChoice} from '@/components/ContextMenu/MenuChoice.tsx';
import {ContextMenuContext} from '@/entrypoints/popup/contexts/ContextMenuContext.ts';
import {UserContext} from '@/entrypoints/popup/contexts/UserContext.ts';
import {ViewContext} from '@/entrypoints/popup/contexts/ViewContext.ts';
import {ChromeData} from '@/utils/ChromeData.ts';
import {DisconnectionReason} from '@/utils/Errors.ts';
import {faArrowLeft, faBell} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useQueryClient} from '@tanstack/react-query';
import classNames from 'classnames';
import {AnimatePresence, motion} from 'motion/react';
import {useCallback, useContext, useRef} from 'react';
import {Link, useNavigate} from 'react-router';
import styles from './style.module.scss';

const APP_ID = 'pxgmg1l46or65551u30wjk1w70vz7q';
const REDIRECT_URL = 'https://klemms.github.io/TwitchRightNow/wxt.html';
const SCOPE = 'user:read:follows user:read:subscriptions';
const AUTH_URL = `https://id.twitch.tv/oauth2/authorize?client_id=${APP_ID}&redirect_uri=${REDIRECT_URL}&response_type=token&scope=${SCOPE}`;

export const TopBar = function TopBar() {
    const {isLoggedIn, username, avatarURL} = useContext(UserContext);
    const {namePosition, backButton} = useContext(ViewContext);
    const {toggleContextMenu, closeContextMenu} = useContext(ContextMenuContext);
    const usernameRef = useRef<HTMLInputElement>(null);

    const queryClient = useQueryClient();

    const onLogin = useCallback(() => {
        browser.tabs.create({url: AUTH_URL});
    }, []);

    const navigate = useNavigate();
    const back = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    return (
        <div
            className={classNames(styles.topBar)}
            style={{
                flexDirection: namePosition === 'right' ? 'row-reverse' : 'row',
            }}
        >
            {isLoggedIn ? (
                <>
                    <motion.div
                        ref={usernameRef}
                        layout
                        layoutId={'user-name'}
                        className={classNames(styles.user)}
                        style={{
                            flexDirection: namePosition === 'right' ? 'row-reverse' : 'row',
                        }}
                        onClick={() => {
                            if (usernameRef.current) {
                                toggleContextMenu(
                                    <ContextMenu origin={usernameRef.current.getBoundingClientRect()}>
                                        <MenuChoice
                                            onClick={() => {
                                                closeContextMenu();
                                                ChromeData.disconnect(DisconnectionReason.USER_LOGGED_OUT).then(
                                                    async () => {
                                                        await queryClient.resetQueries();
                                                        /*await queryClient.resetQueries({
                                                            queryKey: [QueryKeys.DISCONNECTION_REASON],
                                                        });
                                                        queryClient.clear();*/
                                                        navigate('/');
                                                    }
                                                );
                                            }}
                                        >
                                            Disconnect
                                        </MenuChoice>
                                    </ContextMenu>
                                );
                            }
                        }}
                    >
                        <motion.div
                            layout
                            className={styles.avatar}
                            style={{backgroundImage: `url("${avatarURL}")`}}
                        ></motion.div>
                        <motion.div layout={true}>{username}</motion.div>
                    </motion.div>
                </>
            ) : (
                <>
                    <div className={styles.appTitle} style={{paddingLeft: '10px'}}>
                        Twitch Right Now
                    </div>
                    <Button onClick={onLogin}>{browser.i18n.getMessage('login_button')}</Button>
                </>
            )}
            <AnimatePresence>
                {backButton ? (
                    <motion.div
                        layout
                        initial={{opacity: 0, translateX: -100}}
                        animate={{opacity: 1, translateX: 0}}
                        exit={{opacity: 0}}
                        style={{height: '100%'}}
                    >
                        <Button overrideClass={true} className={styles.back} onClick={back}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                            {browser.i18n.getMessage('back')}
                        </Button>
                    </motion.div>
                ) : null}
            </AnimatePresence>
            {!backButton && isLoggedIn ? (
                <motion.div layout initial={{opacity: 0}} animate={{opacity: 1}} style={{height: '100%'}}>
                    <Link to={'/followed'}>
                        <Button overrideClass={true} className={styles.nav}>
                            <FontAwesomeIcon icon={faBell} />
                        </Button>
                    </Link>
                </motion.div>
            ) : null}
        </div>
    );
};
