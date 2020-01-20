import { converToStandardEvent } from '../core/intent.utils';

import { pushEventToTimecampus } from '../core/timecampus.utils';

export const processRecordEvent = async function(from, message, intentResult) {
    console.log('Received::', from, message);

    let tcEvent = converToStandardEvent(intentResult);

    let pushResult = await pushEventToTimecampus(from, tcEvent);

    if (!pushResult) {
        return {
            err: null,
            response: {
                message: `Hi there! There was an error in recording the event. Please try again.`
            }
        };
    }

    return {
        err: null,
        response: {
            message: `Great. I have successfully recorded the event in my books. Anything else I can help you with?`
        }
    };
};
