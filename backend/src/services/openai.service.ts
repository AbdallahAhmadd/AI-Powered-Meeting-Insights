import OpenAI from "openai";
import { config } from '../config/config';
import fs from "fs";

class OpenAIService {
  private openai: OpenAI;

  constructor() {
    if (!config.openai.apiKey) {
      throw new Error('OpenAI API key is not configured');
    }
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey,
    });
  }

  async textToSpeech(videoPath: string) {
    try {
      console.log('Opening file for transcription:', videoPath);
      const fileStream = fs.createReadStream(videoPath);
      
      console.log('Sending to OpenAI for transcription...');
      const transcription = await this.openai.audio.transcriptions.create({
        file: fileStream,
        model: "whisper-1",
        response_format: "text",
      });
      
      console.log('Transcription received from OpenAI');
      return transcription;
    } catch (error) {
      console.error('Error in textToSpeech:', error);
      throw error;
    }
  }
}

export const openAIService = new OpenAIService(); 