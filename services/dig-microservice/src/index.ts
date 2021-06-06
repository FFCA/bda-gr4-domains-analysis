import express from 'express';
import { exec } from 'child_process';

const app = express();
const host = 'localhost';
const port = 8088;

const jsonDig = (dig: string) => {
    // TODO Implement
    return 'This string will be converted to json:' + dig;
};

app.listen(port, host, () => {
    console.log(`Server is running at ${host}:${port}`);

    app.get('/dig', (req, res) => {
        // if (!req.query.ip) {
        //     const msg = 'Request is lackig from the required parameter `ip`.';
        //     res.status(422).send(msg);
        // } else {
        exec('dig google.com', (error, stdout, stderr) => {
            if (stdout) res.send(!req.query.raw ? jsonDig(stdout) : stdout);
            else if (stderr) res.status(500).send(stderr);
            if (error !== null) res.status(500).send(error);
        });
        // }
    });
});
