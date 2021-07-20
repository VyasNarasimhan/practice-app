import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';

import { router as practiceRouter } from './practice/practice';

dotenv.config();

const app = express()
  .use(cors())
  .use(express.json())
  .use('/practice', practiceRouter);

app.listen(4201, () => {
  return console.log('My Node App listening on port 4201');
});


export default app;
