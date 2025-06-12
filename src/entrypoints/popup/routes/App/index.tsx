import {BottomBar} from '@/components/BottomBar';
import {TopBar} from '@/components/TopBar';
import {ViewContextProvider} from '@/entrypoints/popup/contexts/providers/ViewContextProvider.tsx';
import {UserContext} from '@/entrypoints/popup/contexts/UserContext.ts';
import {ChromeData} from '@/utils/ChromeData.ts';
import {DisconnectionReason} from '@/utils/Errors.ts';
import {QueryKeys} from '@/utils/QueryKeys.ts';
import {useQuery} from '@tanstack/react-query';
import {useContext, useEffect, useRef} from 'react';
import {Outlet, useLocation, useNavigate} from 'react-router';
import styles from './style.module.scss';

export const App = function App() {
    const {data: disconnectionReason} = useQuery({
        queryKey: [QueryKeys.DISCONNECTION_REASON],
        queryFn: async () => {
            const reason = await ChromeData.getDisconnectionReason();
            return reason !== DisconnectionReason.NOT_CONNECTED ? reason : false;
        },
    });

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
                        <h3>{browser.i18n.getMessage(disconnectionReason ? 'reconnect_title' : 'login_line1')}</h3>
                        <br />
                        {browser.i18n.getMessage(disconnectionReason ? 'reconnect_line1' : 'login_line2')}
                        <br />
                        {browser.i18n.getMessage(disconnectionReason ? 'reconnect_line2' : 'login_line3')}
                        <br />
                        <br />
                        {browser.i18n.getMessage(disconnectionReason ? 'reconnect_line3' : 'login_line4')}
                        <br />
                        {browser.i18n.getMessage(disconnectionReason ? 'reconnect_line4' : 'login_line5')}
                        <br />
                        {disconnectionReason && (
                            <h5 style={{fontStyle: 'italic', opacity: '0.8'}}>
                                {browser.i18n.getMessage('code')} : {disconnectionReason}
                            </h5>
                        )}
                    </div>
                )}
            </ViewContextProvider>
        </div>
    );
};
