import { Router } from 'express';
import { router as logFileRouter } from './routes/logFile';
import { router as heartBeatRouter} from './routes/heartbeat';


export const router: Router = Router();

router.use('/file', logFileRouter);
router.use('/heartbeat', heartBeatRouter);
