import {memo} from "react";
import styles from "./Tab.module.sass";

const Tab = memo(function Tab({
                                  children,
                                  className,
                                  style
                              }) {
    return (
        <div className={className || styles.tab} style={style || {}}>
            {children}
        </div>
    );
});

export default Tab;
