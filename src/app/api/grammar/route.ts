// app/api/grammar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";
import { authenticateRequest } from '@/lib/authMiddleware';

const ai = new GoogleGenAI({});

export interface GrammarError {
  original: string;
  corrected: string;
  reason: string;
  position: number;
}

export interface GrammarResult {
  originalText: string;
  correctedText: string;
  translatedText: string;
  hasErrors: boolean;
  errors: GrammarError[];
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

    const prompt = `Analyze the following English text for grammar mistakes, provide corrections, and translate to Bangla.

English text: "${text}"

Provide the response in the following JSON format:
{
  "originalText": "the original text",
  "correctedText": "the corrected text (same as original if no errors)",
  "translatedText": "Bangla translation of the corrected text",
  "hasErrors": true or false,
  "errors": [
    {
      "original": "the incorrect word/phrase",
      "corrected": "the correct word/phrase",
      "reason": "explanation in English why it's wrong",
      "position": 0
    }
  ],
  "words": [
    {
      "word": "each English word from corrected text",
      "meaning": "Bangla meaning",
      "position": 0
    }
  ]
}

Rules:
- Check for grammar, spelling, tense, and punctuation errors
- Provide clear explanations for each error in English
- Extract meaningful words (skip articles unless crucial)
- Position indicates word order (starting from 0)
- If no errors, set hasErrors to false and errors to empty array
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
    const result: GrammarResult = JSON.parse(jsonText);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Grammar check error:', error);
    return NextResponse.json(
      { error: 'Failed to check grammar' },
      { status: 500 }
    );
  }
}