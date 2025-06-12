import {useEffect} from 'react';
import MessageSender = chrome.runtime.MessageSender;

export function useEvent(eventName: string, callback: (message: any, sender: MessageSender) => void) {
    useEffect(() => {
        const cb = (message: EventMessage, sender: MessageSender) => {
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
