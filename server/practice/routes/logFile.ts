import { NextFunction, Request, Response, Router } from 'express';
import * as fs from 'fs';

export const router: Router = Router();

router.post('/writeToFile', async (req: Request, res: Response, next: NextFunction) => {
  console.log('Inside writeToFile post');
  fs.writeFile('./server/SongsLog.json', JSON.stringify(req.body), (err: any) => {
    if (err) {
      console.log(err);
    } else {
      res.send({ success: true });
    }
  });
});

router.get('/getFile', async (req: Request, res: Response, next: NextFunction) => {
  console.log('Inside getFile get');
  fs.readFile('./server/SongsLog.json', 'utf8', (err: any, data: any) => {
    if (err) {
      console.log(err);
    } else {
      res.send({ file: data });
    }
  });
});
