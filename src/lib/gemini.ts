// // lib/gemini.ts
// import { GoogleGenAI } from "@google/genai";
// const ai = new GoogleGenAI({});

// export interface WordTest {
//   word: string;
//   meaning: string;
//   options: string[];
//   correctAnswer: string;
// }

// export interface TranslationWord {
//   word: string;
//   meaning: string;
//   position: number;
// }

// export interface TranslationResult {
//   originalText: string;
//   translatedText: string;
//   words: TranslationWord[];
// }

// export interface GrammarError {
//   original: string;
//   corrected: string;
//   reason: string;
//   position: number;
// }

// export interface GrammarResult {
//   originalText: string;
//   correctedText: string;
//   translatedText: string;
//   hasErrors: boolean;
//   errors: GrammarError[];
//   words: TranslationWord[];
// }

// export async function generateDailyTest(): Promise<WordTest[]> {
// const prompt = `Generate exactly 10 vocabulary MCQ questions for a daily test. There will be two types of questions:
// Type 1 (English → Bangla):
// - Ask an English word
// - Provide 4 Bangla meaning options (1 correct + 3 incorrect)

// Type 2 (Bangla → English):
// - Ask a Bangla word
// - Provide 4 English meaning options (1 correct + 3 incorrect)

// Rules:
// - Total 10 questions, randomly mixed (not sequential: e.g., 5 type1 + 5 type2 but shuffled)
// - Words must be unique, intermediate to advanced level
// - Wrong options must be plausible but clearly incorrect
// - Options must be shuffled (correct answer can be at any position)
// - Return ONLY the JSON array in this structure:

// [
//   {
//     "type": "EN_TO_BN",
//     "question": "example",
//     "correct_answer": "correct meaning",
//     "options": ["meaning1", "meaning2", "meaning3", "meaning4"]
//   },
//   {
//     "type": "BN_TO_EN",
//     "question": "উদাহরণ",
//     "correct_answer": "correct meaning",
//     "options": ["meaning1", "meaning2", "meaning3", "meaning4"]
//   }
// ]

// No explanation, no extra text—only return the JSON array.
// `;


//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: prompt,
//     });
    
//     const text = response.text;
    
//     // Check if text is undefined
//     if (!text) {
//       throw new Error('No response text received from Gemini');
//     }
    
//     // Remove markdown code blocks if present
//     const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
//     const words: WordTest[] = JSON.parse(jsonText);
    
//     // Validate the response
//     if (!Array.isArray(words) || words.length !== 10) {
//       throw new Error('Invalid response format from Gemini');
//     }
    
//     // Ensure each word has the correct structure
//     return words.map(word => ({
//       word: word.word,
//       meaning: word.meaning,
//       options: word.options,
//       correctAnswer: word.meaning,
//     }));
//   } catch (error) {
//     console.error('Error generating test with Gemini:', error);
//     throw new Error('Failed to generate daily test');
//   }
// }

// export async function translateText(text: string): Promise<TranslationResult> {
//   const prompt = `Translate the following English text to Bangla and provide word-by-word meanings.

// English text: "${text}"

// Provide the response in the following JSON format:
// {
//   "originalText": "the original English text",
//   "translatedText": "the complete Bangla translation",
//   "words": [
//     {
//       "word": "English word",
//       "meaning": "Bangla meaning",
//       "position": 0
//     }
//   ]
// }

// Rules:
// - Extract each meaningful word (skip articles like 'a', 'an', 'the' unless crucial)
// - Provide accurate Bangla meanings for each word
// - Position indicates the word's order in the sentence (starting from 0)
// - For compound sentences, include all important words
// - Return ONLY valid JSON, no additional text`;

//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: prompt, 
//     });

//     const responseText = response.text;
    
//     if (!responseText) {
//       throw new Error('No response from AI model');
//     }

//     const jsonText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
//     const result: TranslationResult = JSON.parse(jsonText);

//     return result;
//   } catch (error) {
//     console.error('Translation error:', error);
//     throw new Error('Failed to translate text');
//   }
// }

// export async function checkGrammar(text: string): Promise<GrammarResult> {
//   const prompt = `Analyze the following English text for grammar mistakes, provide corrections, and translate to Bangla.

// English text: "${text}"

// Provide the response in the following JSON format:
// {
//   "originalText": "the original text",
//   "correctedText": "the corrected text (same as original if no errors)",
//   "translatedText": "Bangla translation of the corrected text",
//   "hasErrors": true or false,
//   "errors": [
//     {
//       "original": "the incorrect word/phrase",
//       "corrected": "the correct word/phrase",
//       "reason": "explanation in English why it's wrong",
//       "position": 0
//     }
//   ],
//   "words": [
//     {
//       "word": "each English word from corrected text",
//       "meaning": "Bangla meaning",
//       "position": 0
//     }
//   ]
// }

// Rules:
// - Check for grammar, spelling, tense, and punctuation errors
// - Provide clear explanations for each error in English
// - Extract meaningful words (skip articles unless crucial)
// - Position indicates word order (starting from 0)
// - If no errors, set hasErrors to false and errors to empty array
// - Return ONLY valid JSON, no additional text`;

//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: prompt,
//     });

//     const responseText = response.text;
    
//     if (!responseText) {
//       throw new Error('No response from AI model');
//     }

//     const jsonText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
//     const result: GrammarResult = JSON.parse(jsonText);

//     return result;
//   } catch (error) {
//     console.error('Grammar check error:', error);
//     throw new Error('Failed to check grammar');
//   }
// }










// lib/gemini.ts
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({});

export interface WordTest {
  word: string;
  meaning: string;
  options: string[];
  correctAnswer: string;
}

export interface TranslationWord {
  word: string;
  meaning: string;
  position: number;
}

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  words: TranslationWord[];
}

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
  words: TranslationWord[];
}

export async function generateDailyTest(): Promise<WordTest[]> {
const prompt = `Generate exactly 10 vocabulary MCQ questions for a daily test. There will be two types of questions:
Type 1 (English → Bangla):
- Ask an English word
- Provide 4 Bangla meaning options (1 correct + 3 incorrect)

Type 2 (Bangla → English):
- Ask a Bangla word
- Provide 4 English meaning options (1 correct + 3 incorrect)

Rules:
- Total 10 questions, randomly mixed (not sequential: e.g., 5 type1 + 5 type2 but shuffled)
- Words must be unique, intermediate to advanced level
- Wrong options must be plausible but clearly incorrect
- Options must be shuffled (correct answer can be at any position)
- Return ONLY the JSON array in this structure:

[
  {
    "type": "EN_TO_BN",
    "question": "example",
    "correct_answer": "correct meaning",
    "options": ["meaning1", "meaning2", "meaning3", "meaning4"]
  },
  {
    "type": "BN_TO_EN",
    "question": "উদাহরণ",
    "correct_answer": "correct meaning",
    "options": ["meaning1", "meaning2", "meaning3", "meaning4"]
  }
]

No explanation, no extra text—only return the JSON array.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    const text = response.text;
    
    // Check if text is undefined
    if (!text) {
      throw new Error('No response text received from Gemini');
    }
    
    // Remove markdown code blocks if present
    const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const apiResponse = JSON.parse(jsonText);
    
    // Validate the response
    if (!Array.isArray(apiResponse) || apiResponse.length !== 10) {
      throw new Error('Invalid response format from Gemini');
    }
    
    // Map the API response to WordTest format
    return apiResponse.map(item => ({
      word: item.question,           // The question word
      meaning: item.correct_answer,  // The correct answer
      options: item.options,         // All options (including correct answer)
      correctAnswer: item.correct_answer, // The correct answer
    }));
  } catch (error) {
    console.error('Error generating test with Gemini:', error);
    throw new Error('Failed to generate daily test');
  }
}

export async function translateText(text: string): Promise<TranslationResult> {
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

  try {
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

    return result;
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Failed to translate text');
  }
}

export async function checkGrammar(text: string): Promise<GrammarResult> {
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

  try {
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

    return result;
  } catch (error) {
    console.error('Grammar check error:', error);
    throw new Error('Failed to check grammar');
  }
}