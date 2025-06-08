import dotenv from 'dotenv';

dotenv.config();

export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4.1-nano',
  },
  server: {
    port: process.env.PORT || 3000,
  },
} as const; 