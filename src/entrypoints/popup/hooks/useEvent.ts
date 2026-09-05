import type {Browser} from '@wxt-dev/browser';
import {useEffect} from 'react';

export function useEvent(eventName: string, callback: (message: any, sender: Browser.runtime.MessageSender) => void) {
    useEffect(() => {
        const cb = (message: EventMessage, sender: Browser.runtime.MessageSender) => {
            if (message.type === eventName) {
                callback(message.data, sender);
            }
        };

        browser.runtime.onMessage.addListener(cb);

        return () => {
            browser.runtime.onMessage.removeListener(cb);
        };
    }, [callback, eventName]);
}
