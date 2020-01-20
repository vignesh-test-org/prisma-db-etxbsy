'use strict';

let appURL = process.env.APP_URL || 'http://localhost:5010';

export let config = {
    app: {
        title: 'timecampus-channel-whatsapp',
        description: 'Timecampus Whatsapp Integration',
        url: appURL,
        dname: 'timecampus-channel-whatsapp',
        version: '1.0.0'
    },
    port: process.env.NODEJS_PORT,
    hostname: process.env.NODEJS_IP,
    authorization: process.env.WEBHOOK_KEY,

    appID: process.env.APP_ID,

    toggle: {
        apidoc: process.env.TOGGLE_APIDOC || false,
        log: {
            files: process.env.ENABLE_LOG_FILE || false,
            console: process.env.ENABLE_CONSOLE || true
        }
    },

    jaeger: {
        host: process.env.JAEGER_HOST || 'localhost',
        port: process.env.JAEGER_PORT || 6832
    },

    api: {
        timecampus: {
            host: process.env.TIMECAMPUS_HOST,
            clientID: process.env.TIMECAMPUS_CLIENTID,
            clientSecret: process.env.TIMECAMPUS_CLIENTSECRET
        },
        wit: {
            host: 'https://api.wit.ai/message?v=20200113&q=',
            authorization: process.env.WIT_TOKEN
        },
        github: {
            host: 'https://api.github.com',
            authorization: process.env.GITHUB_TOKEN
        }
    },

    whatsapp: {
        all: {
            from: process.env.TWILIO_FROM,
            sid: process.env.TWILIO_SID1,
            token: process.env.TWILIO_TOKEN1
        }
    }
};
