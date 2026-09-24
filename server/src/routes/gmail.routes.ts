import { Router } from 'express';

import {
  connectGmailController,
  gmailCallbackController,
  gmailStatusController,
  listGmailMessagesController,
  syncGmailApplicationsController,
} from '../controllers/gmail.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/connect', authenticate, connectGmailController);
router.get('/oauth/callback', gmailCallbackController);
router.get('/status', authenticate, gmailStatusController);
router.get('/messages', authenticate, listGmailMessagesController);
router.post('/sync', authenticate, syncGmailApplicationsController);

export default router;
