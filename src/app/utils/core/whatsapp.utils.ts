import { Store } from '../db.utils';
let store = new Store();
let db = store.getStore();

const Twilio = require('twilio');

import { config } from '../../../config/config';
import { log } from '../error.utils';
import { detectIntentsAndEntities, processHashTags } from './intent.utils';

import { processGreetings } from '../intents/greetings.utils';

import { processRecordEvent } from '../intents/recordEvent.utils';

import { processDomainMessage } from '../intents/domain.utils';

export const test = async function() {
    await db.channelAuths.findMany({});
};

export const handleWebhookUtil = async function(req) {
    let reqBody = req.body;

    let { event, context } = reqBody;

    console.log('Webhook reqBody:', reqBody);

    if (event === 'app-installed') {
        let { userID, channelID } = context;

        await db.channelAuths.upsert({
            where: {
                userID: userID
            },
            create: {
                userID: userID,
                channelID: channelID,
                status: 'unverified'
            },
            update: {
                channelID: channelID,
                status: 'unverified'
            }
        });
    } else if (event === 'app-uninstalled') {
        let { userID } = context;

        await db.channelAuths.update({
            where: {
                userID: userID
            },
            data: {
                status: 'inactive'
            }
        });
    }

    await console.log('----Webhook received', reqBody);
};

/**
 * Generate OTP
 */
export const generateOTP = function() {
    let digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
};

/**
 *
 * Send Whatsapp message to Users
 * @param to
 * @param message
 * @param type
 */
export const sendWhatsapp = async function(userID, to, message) {
    try {
        let client = new Twilio(
            config.whatsapp['all']['sid'],
            config.whatsapp['all']['token']
        );

        to = 'whatsapp:' + to;

        // TODO: Manage scheduled notifications later

        let status = await client.messages.create({
            body: message,
            from: config.whatsapp['all']['from'],
            to: to
        });

        await db.auditLogs.create({
            data: {
                message: message,
                userID: userID,
                whatsappno: to,
                direction: 'sent'
            },
            include: {
                destinationUser: true
            }
        });

        if (status) {
            return true;
        }
        log('error', {
            message: 'Error in sending SMS',
            err: status
        });
        return false;
    } catch (err) {
        log('error', {
            message: 'Error in sending Whatsapp message',
            err: err
        });

        return false;
    }
};

export const sendInstallOTP = async function(userID, whatsappno) {
    try {
        let OTP = generateOTP();

        let providerData = JSON.stringify({
            whatsappno: 'whatsapp:' + whatsappno,
            OTP: OTP,
            userID: userID
        });

        await db.channelAuths.update({
            where: {
                userID: userID
            },
            data: {
                providerData: providerData
            }
        });

        await sendWhatsapp(
            userID,
            whatsappno,
            `Your OTP for verification is ${OTP}. Please note that it will expire soon. You can always resend the OTP or feel free to get in touch with us if you are stuck.`
        );
    } catch (err) {
        console.log('Error:', err);
        return false;
    }
};

export const verifyInstallOTPUtil = async function(userID, whatsappno, otp) {
    try {
        let result = await db.channelAuths.findOne({
            where: {
                userID: userID
            }
        });

        if (result && result.providerData) {
            let providerData = result.providerData;

            let data = JSON.parse(providerData);

            if (
                data.OTP.toLowerCase() === otp.toLowerCase() &&
                data.whatsappno.toLowerCase() ===
                    ('whatsapp:' + whatsappno).toLowerCase()
            ) {
                await db.channelAuths.update({
                    where: {
                        userID: userID
                    },
                    data: {
                        status: 'verified',
                        whatsappno: 'whatsapp:' + whatsappno
                    }
                });

                return true;
            }

            return false;
        }

        return false;
    } catch (err) {
        console.error('Error:', err);
        return false;
    }
};

export const isVerifiedUser = async function(whatsappno) {
    try {
        let result = await db.channelAuths.findMany({
            where: {
                whatsappno: whatsappno
            },
            select: {
                status: true
            }
        });

        if (result.length > 0 && result[0].status === 'verified') {
            return true;
        }

        return false;
    } catch (err) {
        console.error('Error:', err);
        return false;
    }
};

export const handleMessageUtil = async function(from, message) {
    try {
        console.log('Received message:', message);

        let isVerified = await isVerifiedUser(from);

        if (!isVerified) {
            return {
                err: null,
                response: {
                    message: `Hi there! Looks like you have not yet connected your Whatsapp number to Timecampus. You may want to do that before getting started.
                        To know how, please visit https://docs.timecampus.com/channels/whatsapp.html`
                }
            };
        }

        let domains = processHashTags(message);

        if (domains && domains.length !== 0) {
            return await processDomainMessage(from, message, domains);
        }

        let intentResult = await detectIntentsAndEntities(message);

        if (!intentResult) {
            return {
                err: null,
                response: {
                    message: `OOPS! Looks like my head just popped off. Please try again later.`
                }
            };
        }

        if (
            intentResult['entities']['intent'][0]['value'] === 'greetings' ||
            intentResult['entities']['intent'][0]['value'] === 'help'
        ) {
            return await processGreetings(from, message, intentResult);
        }

        if (intentResult['entities']['intent'][0]['value'] === 'recordEvent') {
            return await processRecordEvent(from, message, intentResult);
        }
    } catch (err) {
        console.error('Error:', err);

        return {
            err: {
                message: 'Authorization Failed!'
            },
            response: {
                message: false
            }
        };
    }
};
