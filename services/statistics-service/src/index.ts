import express from 'express';
import dotenv from 'dotenv';
import Db from './helpers/db-connection';
import statisticsRoutes from './routes/statistics.routes';

// TODO Dockerize

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
const port = process.env.PORT ? +process.env.PORT : 8089;

/**
 * Initialization function for connecting to the database and initializing the
 * Express application. In case of an connection error, this function is recursively
 * called (5 total attempts to connect)
 *
 * @param attempt nr. of attempt (default = 0)
 */
const connect = (attempt = 0) => {
    Db.connect()
        .then(async () => {
            console.log('Successfully connected to DB');
            await Db.registerNotificationListener((n) => console.log(n));
            console.log('Successfully registered DB notifications listener');
            statisticsRoutes(app);
            await app.listen(port, host);
            console.log(`Server is running at ${host}:${port}`);
        })
        .catch((err) => {
            console.error(err);
            if (attempt++ < 5) {
                console.log(`Reconnecting to DB in 5s...(try ${attempt}/5)`);
                setTimeout(() => connect(attempt), 5000);
            } else console.log('Failed too often. Giving up.');
        });
};

/**
 * Connect to the database and initialize the application.
 */
connect();
