import { Request, Response } from 'express';
import { openAIService } from '../services/openai.service';
import path from 'path';
import fs from 'fs';

export const testTranscription = async (req: Request, res: Response) => {
  try {
    // Path to your static MP3 file
    const audioPath = path.join(__dirname, 'test_meeting.mp3');
    
    // Check if file exists
    if (!fs.existsSync(audioPath)) {
      console.error('Audio file not found at:', audioPath);
      return res.status(404).json({ error: 'Audio file not found' });
    }

    const transcription = await openAIService.textToSpeech(audioPath);
    console.log('Transcription completed successfully!');
    
    // Send just the transcription text
    res.send(transcription);
  } catch (error) {
    console.error('Error in testTranscription:', error);
    res.status(500).json({ 
      error: 'Failed to transcribe audio',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 