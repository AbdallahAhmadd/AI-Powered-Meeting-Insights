import { Request, Response } from 'express';
import { openAIService } from '../services/openai.service';
import { textAnalysisService } from '../services/text-analysis.service';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure where and how to store uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create 'uploads' directory if it doesn't exist
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Create multer instance with our storage configuration
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Accept only audio files
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed!'));
    }
  }
});

export const testTranscription = async (req: Request, res: Response) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    console.log('File uploaded:', req.file);

    // Step 1: Transcribe the audio
    console.log('Starting transcription...');
    const transcription = await openAIService.textToSpeech(req.file.path);
    console.log('Transcription completed successfully!');

    // Step 2: Analyze the transcribed text
    console.log('Starting text analysis...');
    const analysis = await textAnalysisService.analyzeMeetingText(transcription);
    console.log('Analysis completed successfully!');

    // Clean up: Delete the uploaded file after processing
    fs.unlinkSync(req.file.path);

    // Return both transcription and analysis
    res.json({
      transcription,
      analysis
    });
  } catch (error) {
    console.error('Error in testTranscription:', error);
    res.status(500).json({ 
      error: 'Failed to process audio',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 