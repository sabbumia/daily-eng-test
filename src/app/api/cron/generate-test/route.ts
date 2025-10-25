// app/api/cron/generate-test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { dailyTests } from '@/db/schema';
import { generateDailyTest } from '@/lib/gemini';
import { eq, and, gte, lt } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const hour = now.getUTCHours();
    
    // Determine test slot: morning (0-11 UTC) or evening (12-23 UTC)
    const testSlot = hour < 12 ? 'morning' : 'evening';
    const testIdentifier = `${today}-${testSlot}`;

    // Check if test already exists for this slot today
    const existingTest = await db
      .select()
      .from(dailyTests)
      .where(eq(dailyTests.testDate, today))
      .limit(2); // Get all tests for today

    // Check if this specific slot already has a test
    const slotExists = existingTest.some(test => {
      const testWords = JSON.parse(test.words);
      return testWords.slot === testSlot;
    });

    if (slotExists) {
      return NextResponse.json({ 
        message: `Test already exists for ${testSlot} slot`,
        date: today,
        slot: testSlot
      });
    }

    // Generate new test using Gemini
    const words = await generateDailyTest();
    
    // Add slot information to the test data
    const testData = {
      slot: testSlot,
      questions: words,
      generatedAt: now.toISOString()
    };

    // Store in database
    await db.insert(dailyTests).values({
      testDate: today,
      words: JSON.stringify(testData),
    });

    return NextResponse.json({ 
      message: 'Daily test generated successfully',
      date: today,
      slot: testSlot,
      wordCount: words.length
    });
  } catch (error) {
    console.error('Error generating daily test:', error);
    return NextResponse.json(
      { error: 'Failed to generate daily test' },
      { status: 500 }
    );
  }
}

// Manual trigger for testing
export async function POST(req: NextRequest) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const words = await generateDailyTest();
    
    const testData = {
      slot: 'manual',
      questions: words,
      generatedAt: new Date().toISOString()
    };

    await db.insert(dailyTests).values({
      testDate: today,
      words: JSON.stringify(testData),
    });

    return NextResponse.json({ 
      message: 'Test generated',
      words 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate test' },
      { status: 500 }
    );
  }
}
