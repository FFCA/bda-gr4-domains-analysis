import { Express } from 'express';
import { exampleRequest } from '../controllers/statistics.controller';

export default module.exports = (app: Express): void => {
    app.get('/example', exampleRequest);
};
