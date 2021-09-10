import { Router } from 'express';
import { router as songsRouter } from './routes/songs';
import { router as heartBeatRouter} from './routes/heartbeat';
import { router as membersRouter } from './routes/members';


export const router: Router = Router();

router.use('/file', songsRouter);
router.use('/members', membersRouter);
router.use('/heartbeat', heartBeatRouter);
