import express from 'express';
import { exec } from 'child_process';
import dotenv from 'dotenv';

/**
 * Loads the dotenv config on initially loading this file.
 */
dotenv.config();

/**
 * Express application.
 */
const app = express();

/**
 * Host the application is to be run on.
 */
const host = process.env.HOST ?? '0.0.0.0';

/**
 * Port the application is to be run on.
 */
const port = process.env.PORT ? +process.env.PORT : 8088;

/**
 * Checks whether a string value contains illegal characters and if so, returns a warning message.
 *
 * @param value Value to be checked.
 * @return Message concerning illegal character or undefined if no illegal character has been found.
 */
const invalidMsg = (value: string): string | undefined => {
    const regex = /[a-z0-9.:\-_]/;
    const chars = [...value.trim()];
    const illegalChar = chars.find((c) => !c.match(regex));
    if (illegalChar) {
        return `Character '${illegalChar}' does not match ${regex} and is thus not considered to be secure.\nCommand will not be executed.`;
    } else if (!value.charAt(0).match(/[a-z0-9]/)) {
        return 'String does not start with number/letter and is thus not considered to be secure.\nCommand will not be executed.';
    } else if (!chars[chars.length - 1].match(/[a-z0-9]/)) {
        return 'String does not end with number/letter and is thus not considered to be secure.\nCommand will not be executed.';
    } else return undefined;
};

/**
 * Starts the application at the specified host/port.
 */
app.listen(port, host, () => {
    console.log(`Dig-microservice is running at ${host}:${port}`);

    /**
     * On requesting the service using /<dig>, a dig request with the given
     * param is performed and, if valid, the result is sent back.
     */
    app.get('/:dig', (req, res) => {
        const value = req.params.dig.trim();
        const warningMsg = invalidMsg(value);

        if (!warningMsg) {
            console.log('processing: ' + value);
            exec(`dig ${value}`, (error, stdout, stderr) => {
                if (stdout) {
                    res.send({
                        answer: stdout,
                        digged: value,
                        timestamp: new Date(),
                    });
                } else if (stderr) {
                    res.status(500).send(stderr);
                } else if (error !== null) {
                    res.status(500).send(error);
                }
            });
        } else {
            res.status(400).send(warningMsg);
            console.warn(warningMsg);
        }
    });
});
