import { Request, Response } from 'express';
import Db from './../helpers/db-connection';

export const exampleRequest = (req: Request, res: Response): void => {
    Db.executeQuery('select * from domain')
        .then((result) => res.send(result.rows))
        .catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });
};
