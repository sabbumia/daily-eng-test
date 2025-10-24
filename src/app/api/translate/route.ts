// app/api/translate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";
import { authenticateRequest } from '@/lib/authMiddleware';

const ai = new GoogleGenAI({});

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  words: Array<{
    word: string;
    meaning: string;
    position: number;
  }>;
}

export async function POST(req: NextRequest) {
  const auth = authenticateRequest(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { text } = await req.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const prompt = `Translate the following English text to Bangla and provide word-by-word meanings.

English text: "${text}"

Provide the response in the following JSON format:
{
  "originalText": "the original English text",
  "translatedText": "the complete Bangla translation",
  "words": [
    {
      "word": "English word",
      "meaning": "Bangla meaning",
      "position": 0
    }
  ]
}

Rules:
- Extract each meaningful word (skip articles like 'a', 'an', 'the' unless crucial)
- Provide accurate Bangla meanings for each word
- Position indicates the word's order in the sentence (starting from 0)
- For compound sentences, include all important words
- Return ONLY valid JSON, no additional text`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const responseText = response.text;
    
    if (!responseText) {
      throw new Error('No response from AI model');
    }

    const jsonText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const result: TranslationResult = JSON.parse(jsonText);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Failed to translate text' },
      { status: 500 }
    );
  }
}