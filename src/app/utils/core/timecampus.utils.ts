import { config } from '../../../config/config';
import { apiCall } from '../api.utils';

import { Store } from '../db.utils';
let store = new Store();
let db = store.getStore();

export const resolveUserID = async function(whatsappno) {
    try {
        console.log('---------whatsappno::', whatsappno);

        let result = await db.channelAuths.findMany({
            where: {
                whatsappno: whatsappno
            },
            select: {
                userID: true
            },
            first: 1
        });

        console.log('Result::', result);

        if (result.length > 0) {
            return result[0].userID;
        }

        return false;
    } catch (err) {
        console.error('Error:', err);
        return false;
    }
};

export const getAccessToken = async function(whatsappno) {
    try {
        let userID = await resolveUserID(whatsappno);

        let tokenResult = await apiCall({
            method: 'post',
            url: config.api.timecampus.host + '/auth/app/generate/token',
            data: {
                appID: config.appID,
                userID: userID
            },
            headers: {
                clientID: config.api.timecampus.clientID,
                clientSecret: config.api.timecampus.clientSecret,
                'Content-Type': 'application/json'
            }
        });

        if (tokenResult.err) {
            return false;
        }

        return tokenResult.response.response.token;
    } catch (err) {
        console.log('Error:', err);
        return false;
    }
};

export const pushEventToTimecampus = async function(whatsappno, eventObj) {
    try {
        let token = await getAccessToken(whatsappno);

        let authResult = await db.channelAuths.findMany({
            where: {
                whatsappno: whatsappno
            },
            first: 1
        });

        if (authResult.length === 0) {
            return false;
        }

        let channelID = authResult[0].channelID;

        let result = await apiCall({
            method: 'POST',
            url: config.api.timecampus.host + '/gateway/graphql',
            headers: {
                authorization: token,
                'Content-Type': 'application/json'
            },
            data: {
                query:
                    'mutation createEvents(\n  $eventObjList: [CreateEventInput]\n) {\n    createEvents(events:$eventObjList){\n      id\n      name\n      description\n      startTime\n      endTime\n      eventType\n      channel {\n        id\n        name\n        description\n      }\n    }\n  }',
                variables: {
                    eventObjList: [
                        {
                            name: eventObj.event,
                            key: eventObj.event,
                            description: eventObj.text,
                            eventType: 'whatsapp',
                            startTime: eventObj.fromTime,
                            endTime: eventObj.toTime,
                            status: 'completed',
                            location: {
                                name: 'Unknown',
                                lat: 0.0,
                                lon: 0.0
                            },
                            channel: channelID
                        }
                    ]
                },
                operationName: 'createEvents'
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
