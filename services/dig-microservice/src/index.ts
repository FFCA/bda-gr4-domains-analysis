import express from 'express';
import { exec } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const host = process.env.HOST ?? '0.0.0.0';
const port = process.env.PORT ? +process.env.PORT : 8088;

const jsonDig = (dig: string) => {
    // TODO Implement?
    return dig;
};

/**
 * Starts the application at the specified host/port.
 */
app.listen(port, host, () => {
    console.log(`Dig-microservice is running at ${host}:${port}`);

    // TODO: Add optional params, i.e. flags?

    /**
     * On requesting the service using /<dig>, a dig request with the given
     * param is performed and, if valid, the result is sent back.
     */
    app.get('/:dig', (req, res) => {
        exec(`dig ${req.params.dig}`, (error, stdout, stderr) => {
            if (stdout) {
                res.send({
                    answer: !req.query.raw ? jsonDig(stdout) : stdout,
                    digged: req.params.dig,
                    timestamp: new Date(),
                });
            } else if (stderr) res.status(500).send(stderr);
            else if (error !== null) res.status(500).send(error);
        });
    });
});
