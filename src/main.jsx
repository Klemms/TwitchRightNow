import React from 'react';
import ReactDOM from 'react-dom/client';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import './index.sass';
import './variables.scss';
import {initREST} from './App/rest/API';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import fr from 'javascript-time-ago/locale/fr';
import zh from 'javascript-time-ago/locale/zh';
import de from 'javascript-time-ago/locale/de';
import it from 'javascript-time-ago/locale/it';
import es from 'javascript-time-ago/locale/es';
import hi from 'javascript-time-ago/locale/hi';
import uk from 'javascript-time-ago/locale/uk';
import pt from 'javascript-time-ago/locale/pt';
import ru from 'javascript-time-ago/locale/ru';
import ko from 'javascript-time-ago/locale/ko';
import {HashRouter, Route, Routes} from "react-router";
import {App} from './routes/App';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

gsap.registerPlugin(useGSAP);
initREST();

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

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <HashRouter>
                <Routes>
                    <Route path={'/'} element={<App/>}>
                    </Route>
                </Routes>
            </HashRouter>
        </QueryClientProvider>
    </React.StrictMode>
);
