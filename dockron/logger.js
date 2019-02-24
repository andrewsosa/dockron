const path = require('path');
const { createLogger, format, transports } = require('winston');

const { combine, label, timestamp, printf, colorize, splat } = format;

const logger = caller =>
    createLogger({
        level: 'debug',
        format: combine(
            format(info => {
                // eslint-disable-next-line no-param-reassign
                info.level = info.level.toUpperCase();
                return info;
            })(),
            timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
            }),
            label({ label: path.basename(caller).slice(0, -3) }),
            splat(),
            colorize(),
            printf(
                info =>
                    `${info.timestamp} ${info.level} [${info.label}]: ${
                        info.message
                    }`,
            ),
        ),
        transports: [
            new transports.Console({
                silent: process.env.NODE_ENV === 'test',
            }),
        ],
    });

module.exports = logger;
