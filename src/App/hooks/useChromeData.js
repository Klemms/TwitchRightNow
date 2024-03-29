import {useCallback, useEffect, useState} from "react";
import ChromeData from '../../ChromeData';

// Could be improved, if multiple components use the same data and one changes it, changes won't be propagated to the others
export function useChromeData(dataName, isSync = true) {
    const [currentData, setCurrentData] = useState(null);

    const setData = useCallback(data => {
        ChromeData.setRawData(dataName, data, isSync).then(() => {
            setCurrentData(data);
        });
    }, [dataName]);

    useEffect(() => {
        ChromeData.getRawData(dataName, isSync).then(value => {
            setCurrentData(value);
        });
    }, [dataName]);

    return {
        data: currentData,
        setData: setData
    };
}
