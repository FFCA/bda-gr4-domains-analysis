import express from 'express';
import { exec } from 'child_process';

const app = express();
const host = 'localhost';
const port = 8088;

app.listen(port, host, () => {
    console.log(`Server is running at ${host}:${port}`);

    exec('dig google.com', (error, stdout, stderr) => {
        console.log('1', stdout);
        console.log('2', stderr);
        if (error !== null) console.log(`exec error: ${error}`);
    });
});
