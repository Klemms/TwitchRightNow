import {SearchContextProvider} from '@/entrypoints/popup/contexts/providers/SearchContextProvider.tsx';
import {UserContextProvider} from '@/entrypoints/popup/contexts/providers/UserContextProvider.tsx';
import {App} from '@/entrypoints/popup/routes/App';
import {Livestreams} from '@/entrypoints/popup/routes/Livestreams';
import {VideosPlus} from '@/entrypoints/popup/routes/VideosPlus';
import {useGSAP} from '@gsap/react';
import '@/entrypoints/popup/main.sass';
import '@/entrypoints/popup/variables.scss';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import gsap from 'gsap';
import TimeAgo from 'javascript-time-ago';
import de from 'javascript-time-ago/locale/de';
import en from 'javascript-time-ago/locale/en';
import es from 'javascript-time-ago/locale/es';
import fr from 'javascript-time-ago/locale/fr';
import hi from 'javascript-time-ago/locale/hi';
import it from 'javascript-time-ago/locale/it';
import ko from 'javascript-time-ago/locale/ko';
import pt from 'javascript-time-ago/locale/pt';
import ru from 'javascript-time-ago/locale/ru';
import uk from 'javascript-time-ago/locale/uk';
import zh from 'javascript-time-ago/locale/zh';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {HashRouter, Route, Routes} from 'react-router';

gsap.registerPlugin(useGSAP);

// Based on the most used languages for the extension according to Google dashboard
TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(fr);
TimeAgo.addLocale(zh);
TimeAgo.addLocale(de);
TimeAgo.addLocale(it);
TimeAgo.addLocale(es);
TimeAgo.addLocale(hi);
TimeAgo.addLocale(uk);
TimeAgo.addLocale(pt);
TimeAgo.addLocale(ru);
TimeAgo.addLocale(ko);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <UserContextProvider>
                <SearchContextProvider>
                    <HashRouter>
                        <Routes>
                            <Route path={'/'} element={<App />}>
                                <Route path={'/livestreams'} element={<Livestreams />} />
                                <Route path={'/videos/:userId'} element={<VideosPlus />} />
                            </Route>
                        </Routes>
                    </HashRouter>
                </SearchContextProvider>
            </UserContextProvider>
            {/*<ReactQueryDevtools initialIsOpen={false} />*/}
        </QueryClientProvider>
    </React.StrictMode>
);

window.APP_READY = true;
