import {useEffect} from "react";
import MessageSender = chrome.runtime.MessageSender;

export function useEvent(eventName: string, callback: (message: any, sender: MessageSender) => void) {
    useEffect(() => {
        const cb = (message: EventMessage, sender: MessageSender) => {
            if (message.type === eventName) {
                callback(message.data, sender);
            }
        };

        chrome.runtime.onMessage.addListener(cb);

        return () => {
            chrome.runtime.onMessage.removeListener(cb);
        };
    }, []);
}