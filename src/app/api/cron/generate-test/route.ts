// // app/api/cron/generate-test/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { db } from '@/db';
// import { dailyTests } from '@/db/schema';
// import { generateDailyTest } from '@/lib/gemini';
// import { eq, and, gte, lt } from 'drizzle-orm';

// export async function GET(req: NextRequest) {
//   // Verify cron secret to prevent unauthorized access
//   const authHeader = req.headers.get('authorization');
//   if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   try {
//     const now = new Date();
//     const today = now.toISOString().split('T')[0];
//     const hour = now.getUTCHours();
    
//     // Determine test slot: morning (0-11 UTC) or evening (12-23 UTC)
//     const testSlot = hour < 12 ? 'morning' : 'evening';
//     const testIdentifier = `${today}-${testSlot}`;

//     // Check if test already exists for this slot today
//     const existingTest = await db
//       .select()
//       .from(dailyTests)
//       .where(eq(dailyTests.testDate, today))
//       .limit(2); // Get all tests for today

//     // Check if this specific slot already has a test
//     const slotExists = existingTest.some(test => {
//       const testWords = JSON.parse(test.words);
//       return testWords.slot === testSlot;
//     });

//     if (slotExists) {
//       return NextResponse.json({ 
//         message: `Test already exists for ${testSlot} slot`,
//         date: today,
//         slot: testSlot
//       });
//     }

//     // Generate new test using Gemini
//     const words = await generateDailyTest();
    
//     // Add slot information to the test data
//     const testData = {
//       slot: testSlot,
//       questions: words,
//       generatedAt: now.toISOString()
//     };

//     // Store in database
//     await db.insert(dailyTests).values({
//       testDate: today,
//       words: JSON.stringify(testData),
//     });

//     return NextResponse.json({ 
//       message: 'Daily test generated successfully',
//       date: today,
//       slot: testSlot,
//       wordCount: words.length
//     });
//   } catch (error) {
//     console.error('Error generating daily test:', error);
//     return NextResponse.json(
//       { error: 'Failed to generate daily test' },
//       { status: 500 }
//     );
//   }
// }

// // Manual trigger for testing
// export async function POST(req: NextRequest) {
//   try {
//     const today = new Date().toISOString().split('T')[0];
//     const words = await generateDailyTest();
    
//     const testData = {
//       slot: 'manual',
//       questions: words,
//       generatedAt: new Date().toISOString()
//     };

//     await db.insert(dailyTests).values({
//       testDate: today,
//       words: JSON.stringify(testData),
//     });

//     return NextResponse.json({ 
//       message: 'Test generated',
//       words 
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to generate test' },
//       { status: 500 }
//     );
//   }
// }














// app/api/cron/generate-test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { dailyTests } from '@/db/schema';
import { generateDailyTest } from '@/lib/gemini';
import { eq } from 'drizzle-orm';

// Increase timeout for this route (Vercel limit is 60s for Hobby plan)
export const maxDuration = 60; // seconds

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = req.headers.get('authorization');
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;
    
    console.log('Received auth header:', authHeader ? 'Present' : 'Missing');
    console.log('Expected format:', expectedAuth ? 'Configured' : 'Not configured');
    console.log('CRON_SECRET exists:', process.env.CRON_SECRET ? 'Yes' : 'No');
    console.log('Auth match:', authHeader === expectedAuth);
    
    if (authHeader !== expectedAuth) {
      console.error('Unauthorized access attempt');
      return NextResponse.json({ 
        error: 'Unauthorized',
        debug: {
          hasAuthHeader: !!authHeader,
          hasEnvSecret: !!process.env.CRON_SECRET,
          receivedHeaderLength: authHeader?.length || 0,
          expectedHeaderLength: expectedAuth?.length || 0
        },
        timestamp: new Date().toISOString()
      }, { status: 401 });
    }

    const today = new Date().toISOString().split('T')[0];
    console.log('Checking for existing test on:', today);

    // Check if test already exists for today
    const existingTest = await db
      .select()
      .from(dailyTests)
      .where(eq(dailyTests.testDate, today))
      .limit(1);

    if (existingTest.length > 0) {
      console.log('Test already exists for today');
      return NextResponse.json({ 
        message: 'Test already exists for today',
        date: today,
        executionTime: `${Date.now() - startTime}ms`
      }, { status: 200 });
    }

    console.log('Generating new test with Gemini...');
    
    // Generate new test using Gemini
    const words = await generateDailyTest();
    
    console.log('Test generated, storing in database...');

    // Store in database
    await db.insert(dailyTests).values({
      testDate: today,
      words: JSON.stringify(words),
    });

    console.log('Test stored successfully');

    const executionTime = Date.now() - startTime;
    
    return NextResponse.json({ 
      success: true,
      message: 'Daily test generated successfully',
      date: today,
      wordCount: words.length,
      executionTime: `${executionTime}ms`,
      timestamp: new Date().toISOString()
    }, { status: 200 });
    
  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.error('Error generating daily test:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate daily test',
      details: error instanceof Error ? error.message : 'Unknown error',
      executionTime: `${executionTime}ms`,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Manual trigger for testing (remove in production or add authentication)
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    const today = new Date().toISOString().split('T')[0];
    console.log('Manual test generation for:', today);
    
    const words = await generateDailyTest();

    await db.insert(dailyTests).values({
      testDate: today,
      words: JSON.stringify(words),
    });

    const executionTime = Date.now() - startTime;

    return NextResponse.json({ 
      success: true,
      message: 'Test generated',
      words,
      executionTime: `${executionTime}ms`
    });
  } catch (error) {
    const executionTime = Date.now() - startTime;
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate test',
      details: error instanceof Error ? error.message : 'Unknown error',
      executionTime: `${executionTime}ms`
    }, { status: 500 });
  }
}
