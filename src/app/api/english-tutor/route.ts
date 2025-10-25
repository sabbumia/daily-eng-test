import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as Blob;
    const conversationHistory = JSON.parse(formData.get('conversationHistory') as string || '[]');

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Step 1: Transcribe audio with Groq Whisper
    const transcriptionFormData = new FormData();
    transcriptionFormData.append('file', audioFile, 'audio.webm');
    transcriptionFormData.append('model', 'whisper-large-v3-turbo');
    transcriptionFormData.append('language', 'en');
    transcriptionFormData.append('response_format', 'json');

    const transcriptionResponse = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: transcriptionFormData
    });

    if (!transcriptionResponse.ok) {
      const error = await transcriptionResponse.text();
      console.error('Transcription error:', error);
      return NextResponse.json({ error: 'Transcription failed. Please try again.' }, { status: 500 });
    }

    const transcriptionData = await transcriptionResponse.json();
    const transcript = transcriptionData.text;

    // Build conversation context with recent messages
    const contextMessages = conversationHistory.slice(-8);
    
    // Step 2: Generate intelligent tutor response
    const messages = [
      {
        role: 'system',
        content: `You are an expert English speaking tutor with years of experience helping students achieve fluency. Your teaching philosophy:

**Core Responsibilities:**
1. Engage in natural, flowing conversations that feel authentic and supportive
2. Identify and gently correct grammar, vocabulary, and pronunciation errors
3. Adapt your language complexity to match the student's proficiency level
4. Ask thoughtful follow-up questions to encourage continued practice
5. Provide specific, actionable feedback that builds confidence
6. Celebrate improvements and maintain an encouraging tone

**Communication Style:**
- Keep responses conversational and under 80 words
- Use natural language transitions and expressions
- Incorporate the student's topic of interest naturally
- Correct errors by modeling proper usage in your response
- Example: If they say "I go to mall yesterday" → "Oh, you WENT to the mall yesterday? That sounds fun! What did you buy there?"

**Error Handling:**
- Don't explicitly say "you made a mistake" - model correct usage naturally
- Focus on 1-2 most important corrections per response
- Balance correction with encouragement (70% positive, 30% corrective)
- If pronunciation seems off (based on grammar patterns), gently guide

**Conversation Strategy:**
- Ask open-ended questions that require elaboration
- Connect topics to real-life experiences
- Introduce new vocabulary naturally and contextually
- Encourage storytelling and description

Remember: You're not just correcting - you're building confidence and fluency through meaningful conversation.`
      },
      ...contextMessages.map((msg: string) => {
        const [role, content] = msg.split(': ', 2);
        return {
          role: role === 'User' ? 'user' : 'assistant',
          content: content
        };
      }),
      {
        role: 'user',
        content: transcript
      }
    ];

    const chatResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        temperature: 0.8,
        max_tokens: 180,
        top_p: 0.9
      })
    });

    if (!chatResponse.ok) {
      const error = await chatResponse.text();
      console.error('Chat error:', error);
      return NextResponse.json({ error: 'Failed to generate response. Please try again.' }, { status: 500 });
    }

    const chatData = await chatResponse.json();
    const response = chatData.choices?.[0]?.message?.content || 'I apologize, I need a moment. Could you repeat that?';

    // Step 3: Generate detailed learning tips
    let corrections: string[] = [];
    
    if (transcript.length > 5) {
      const analysisResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `You are an English grammar and pronunciation expert. Analyze the student's speech and provide 1-2 specific, actionable tips for improvement.

Focus on:
- Grammar errors (verb tense, subject-verb agreement, articles)
- Word choice and vocabulary enhancement
- Sentence structure improvements
- Common ESL mistakes

Format: Return ONLY the tips, one per line. Be specific and constructive.
If the speech is nearly perfect, return: "Excellent job! Your grammar and structure are very good."

Example good tips:
"Try using past tense: 'went' instead of 'go' for past events"
"Consider using 'the' before specific places: 'the mall' instead of 'mall'"
"Great sentence structure! Try adding more descriptive words next time"

Keep each tip under 15 words.`
            },
            {
              role: 'user',
              content: `Analyze this speech: "${transcript}"`
            }
          ],
          temperature: 0.4,
          max_tokens: 120
        })
      });

      if (analysisResponse.ok) {
        const analysisData = await analysisResponse.json();
        const tips = analysisData.choices?.[0]?.message?.content || '';
        if (tips && !tips.toLowerCase().includes('excellent job') || tips.toLowerCase().includes('great')) {
          corrections = tips
            .split('\n')
            .filter((tip: string) => tip.trim().length > 0 && !tip.match(/^\d+\./))
            .map((tip: string) => tip.replace(/^[-•*]\s*/, '').trim())
            .slice(0, 2);
        }
      }
    }

    return NextResponse.json({
      transcript,
      response,
      corrections: corrections.length > 0 ? corrections : undefined
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.' 
    }, { status: 500 });
  }
}