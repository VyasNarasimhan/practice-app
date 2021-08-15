import { NextFunction, Request, Response, Router } from 'express';
import * as fs from 'fs';

export const router: Router = Router();

router.post('/writeToFile', async (req: Request, res: Response, next: NextFunction) => {
  console.log('Inside writeToFile post');
  const name = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1).toLowerCase();
  fs.writeFile('./server/songslogs/' + name + 'SongsLog.json', JSON.stringify(req.body.json), (err: any) => {
    if (err) {
      console.log(err);
    } else {
      res.send({ success: true });
    }
  });
});

router.get('/getFile/:name', async (req: Request, res: Response, next: NextFunction) => {
  console.log('Inside getFile get');
  const name = req.params.name.charAt(0).toUpperCase() + req.params.name.slice(1).toLowerCase();
  if (fs.existsSync('./server/songslogs/' + name + 'SongsLog.json')) {
    // tslint:disable-next-line: max-line-length
    fs.readFile('./server/songslogs/' + name + 'SongsLog.json', 'utf8', (err: any, data: any) => {
      if (err) {
        console.log(err);
      } else {
        res.send({ file: data });
      }
    });
  } else {
    console.log('File does not exist');
  }
});
