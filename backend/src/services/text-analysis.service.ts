import OpenAI from "openai";
import { config } from '../config/config';

class TextAnalysisService {
    private openai: OpenAI;

    constructor() {
        if (!config.openai.apiKey) {
            throw new Error('OpenAI API key is not configured');
        }
        this.openai = new OpenAI({
            apiKey: config.openai.apiKey,
        });
    }

    async analyzeMeetingText(text: string) {
        try {
            console.log('Analyzing meeting text...');
            const response = await this.openai.chat.completions.create({
                model: config.openai.model,
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert meeting analyst. Analyze the transcript and provide a concise, structured summary with:

                            1. EXECUTIVE SUMMARY (2-3 sentences)
                            2. KEY DECISIONS
                            - List each decision with who made it
                            - Include deadlines if mentioned
                            3. ACTION ITEMS
                            - Who is responsible
                            - What needs to be done
                            - When it's due
                            4. FOLLOW-UP POINTS
                            - Topics that need more discussion
                            - Questions that need answers
                            5. NEXT STEPS
                            - Immediate actions
                            - Future meetings if mentioned

                            Format in clear, bullet points. Be specific and actionable.`
                    },
                    {
                        role: 'user',
                        content: `Please analyze this meeting transcript:\n\n${text}`
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000,
                presence_penalty: 0.1,
                frequency_penalty: 0.1, 
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('Error analyzing text:', error);
            throw error;
        }
    }
}

export const textAnalysisService = new TextAnalysisService(); 