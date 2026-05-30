import {EventNames} from '@/utils/EventNames.ts';

function sendEvent(eventName: EventNames, data: any = null) {
    browser.runtime
        .sendMessage({
            type: eventName,
            data: data,
        })
        .catch(() => {});
}

export const Events = {
    sendEvent,
};
