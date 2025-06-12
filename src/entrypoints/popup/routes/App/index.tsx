import {BottomBar} from '@/components/BottomBar';
import {TopBar} from '@/components/TopBar';
import {ViewContextProvider} from '@/entrypoints/popup/contexts/providers/ViewContextProvider.tsx';
import {UserContext} from '@/entrypoints/popup/contexts/UserContext.ts';
import {useContext, useEffect, useRef} from 'react';
import {Outlet, useLocation, useNavigate} from 'react-router';
import styles from './style.module.scss';

export const App = function App() {
    const {isLoggedIn} = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isLoggedIn && location.pathname === '/') {
            navigate('/livestreams');
        }
    }, [isLoggedIn, location.pathname, navigate]);

    return (
        <div className={styles.app}>
            <ViewContextProvider outlet={ref}>
                <TopBar />
                {isLoggedIn ? (
                    <>
                        <div className={styles.outlet} ref={ref}>
                            <Outlet />
                        </div>
                        <BottomBar />
                    </>
                ) : (
                    <div className={styles.disconnected}>
                        <h3>{browser.i18n.getMessage('login_line1')}</h3>
                        <br />
                        {browser.i18n.getMessage('login_line2')}
                        <br />
                        {browser.i18n.getMessage('login_line3')}
                        <br />
                        <br />
                        {browser.i18n.getMessage('login_line4')}
                        <br />
                        {browser.i18n.getMessage('login_line5')}
                    </div>
                )}
            </ViewContextProvider>
        </div>
    );
};
