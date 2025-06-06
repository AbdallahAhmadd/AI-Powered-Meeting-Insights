import { Router } from 'express';
import {  testTranscription } from '../controllers/meeting.controller';

const router = Router();


router.get('/test-transcription', testTranscription);

export default router; 