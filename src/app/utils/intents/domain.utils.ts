import { apiCall } from '../api.utils';
import { resolveUserID } from '../core/timecampus.utils';
import { config } from '../../../config/config';

export const processFeedbackMessage = async function(from, message) {
    console.log('Recording feedback:', from, message);

    let userID = await resolveUserID(from);

    let result = await apiCall({
        url:
            config.api.github.host +
            '/repos/timecampus/timecampus-feedback/issues',
        method: 'POST',
        data: {
            title: 'Feedback - ' + userID,
            body: message,
            assignees: ['tvvignesh'],
            milestone: 1,
            labels: ['feedback', 'triage', 'whatsapp']
        },
        headers: {
            authorization: config.api.github.authorization,
            'Content-Type': 'application/json'
        }
    });

    return {
        err: null,
        response: {
            message: `Hi. Thank you. Your feedback has been recorded. You can track the status here: ${result.response['html_url']}. We will get back to you soon!`
        }
    };
};

export const processSupportMessage = async function(from, message) {
    console.log('Recording support request:', from, message);

    let userID = await resolveUserID(from);

    let result = await apiCall({
        url:
            config.api.github.host +
            '/repos/tvvignesh/timecampus-support/issues',
        method: 'POST',
        data: {
            title: 'Support - ' + userID,
            body: message,
            assignees: ['tvvignesh'],
            milestone: 1,
            labels: ['support', 'triage', 'whatsapp']
        },
        headers: {
            authorization: config.api.github.authorization,
            'Content-Type': 'application/json'
        }
    });

    return {
        err: null,
        response: {
            message: `Hi. Thank you. Your support request has been recorded. Your Ticket Number is ${result.response['number']}. We will get back to you soon!`
        }
    };
};

export const processDomainMessage = async function(from, message, domains) {
    console.log('Domain message:', from, message, domains);

    if (domains.includes('feedback')) {
        let result = await processFeedbackMessage(from, message);
        return result;
    }

    if (domains.includes('support')) {
        let result = await processSupportMessage(from, message);
        return result;
    }

    return {
        err: null,
        response: {
            message: `Sorry. Looks like I don't understand you properly. Valid hash tags are #feedback and #support`
        }
    };
};
