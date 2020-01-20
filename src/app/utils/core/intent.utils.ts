import { config } from '../../../config/config';

import { apiCall } from '../api.utils';

export const detectIntentsAndEntities = async function(message) {
    try {
        message = encodeURIComponent(message);

        let result = await apiCall({
            method: 'get',
            url: config.api.wit.host + message,
            headers: {
                authorization: config.api.wit.authorization
            }
        });

        if (result.err) {
            return false;
        }

        return result.response;
    } catch (err) {
        console.error('Error:', err);
        return false;
    }
};

export const converToStandardEvent = function(entityObj) {
    let agenda = 'Unknown';
    let fromTime = new Date().toISOString();
    let toTime = new Date().toISOString();
    let text = entityObj['_text'];

    if (entityObj['entities']['agenda_entry']) {
        agenda = entityObj['entities']['agenda_entry'][0].value || 'Unknown';
    }

    if (entityObj['entities']['datetime']) {
        let dateTime = entityObj['entities']['datetime'][0];

        if (dateTime['values'][0]['type'] === 'interval') {
            if (dateTime['values'][0]['from']) {
                fromTime = dateTime['values'][0]['from']['value'];
            }

            if (dateTime['values'][0]['to']) {
                toTime = dateTime['values'][0]['to']['value'];
            }
        } else if (dateTime['values'][0]['type'] === 'value') {
            fromTime = dateTime['values'][0]['value'];
            toTime = dateTime['values'][0]['value'];
        }
    }

    return {
        event: agenda,
        fromTime: fromTime,
        toTime: toTime,
        text: text
    };
};

export const processHashTags = function(message) {
    let regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
    let matches = [];
    let match;

    while ((match = regex.exec(message))) {
        matches.push(match[1]);
    }

    return matches;
};
