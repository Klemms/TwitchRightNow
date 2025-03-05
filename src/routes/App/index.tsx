import styles from './style.module.scss';
import {Outlet} from "react-router";
import {TopBar} from '../../components/TopBar';

export const App = function App() {
    return (
        <div className={styles.app}>
            <TopBar/>
            <Outlet/>
        </div>
    );
}