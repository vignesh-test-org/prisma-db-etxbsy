const { Tags } = require('opentracing');
import { config } from '../../config/config';
const logger = require('winston');

let transports = [];

let dateStr = new Date().toISOString();

if (config.toggle.log.files) {
    transports.push(
        new logger.transports.File({
            filename: 'logs/' + dateStr + '-error.log',
            level: 'error'
        })
    );

    transports.push(
        new logger.transports.File({
            filename: 'logs/' + dateStr + '-info.log',
            level: 'info'
        })
    );
}

if (config.toggle.log.console) {
    transports.push(new logger.transports.Console());
}

logger.configure({
    transports: transports
});

type LogLevelType = 'info' | 'error' | 'warn';

/**
 *
 * LOG ERRORS/MESSAGES to multiple channels
 * @param level Logger level
 * @param payload Payload to log
 * @param span Jaeger span object
 * @param tagObj Tag Object for jaeger
 */
export const log = async function(
    level: LogLevelType,
    payload,
    span = undefined,
    tagObj = undefined
) {
    if (span && tagObj) {
        for (let tag in tagObj) {
            if (Object.prototype.hasOwnProperty.call(tagObj, tag)) {
                span.setTag(tag, tagObj[tag]);
            }
        }
    }

    if (span && level === 'error') {
        span.setTag(Tags.ERROR, true);
    }

    await logger.log(level, JSON.stringify(payload));

    if (span) {
        span.log(payload);
    }
};
