// app/api/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { dailyTests, userTestAttempts, users, savedWords } from '@/db/schema';
import { authenticateRequest } from '@/lib/authMiddleware';
import { eq, and, gte, desc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const auth = authenticateRequest(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get user's registration date
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, auth.userId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const registrationDate = user.createdAt.toISOString().split('T')[0];

    // Get all tests on or after user's registration date
    const allTests = await db
      .select()
      .from(dailyTests)
      .where(gte(dailyTests.testDate, registrationDate))
      .orderBy(dailyTests.testDate);

    // Get user's completed tests
    const completedTests = await db
      .select()
      .from(userTestAttempts)
      .where(
        and(
          eq(userTestAttempts.userId, auth.userId),
          eq(userTestAttempts.completed, true)
        )
      )
      .orderBy(desc(userTestAttempts.attemptedAt));

    const completedTestIds = new Set(completedTests.map(t => t.testId));

    // Calculate average score
    const totalScore = completedTests.reduce((sum, test) => sum + test.score, 0);
    const averageScore = completedTests.length > 0 ? totalScore / completedTests.length : 0;

    // Get saved words count
    const allSavedWords = await db
      .select()
      .from(savedWords)
      .where(eq(savedWords.userId, auth.userId));

    // Get recent saved words (last 5)
    const recentSavedWords = await db
      .select()
      .from(savedWords)
      .where(eq(savedWords.userId, auth.userId))
      .orderBy(desc(savedWords.createdAt))
      .limit(5);

    // Find first incomplete test
    let nextAvailableTest = null;
    for (const test of allTests) {
      if (!completedTestIds.has(test.id)) {
        nextAvailableTest = test;
        break;
      }
    }

    // Get user's progress
    const userProgress = allTests.map(test => {
      const attempt = completedTests.find(ct => ct.testId === test.id);
      return {
        id: test.id,
        date: test.testDate,
        completed: completedTestIds.has(test.id),
        score: attempt?.score || 0,
      };
    });

    return NextResponse.json({
      nextTest: nextAvailableTest,
      progress: userProgress,
      totalTests: allTests.length,
      completedCount: completedTests.length,
      registrationDate,
      savedWordsCount: allSavedWords.length,
      averageScore: Math.round(averageScore * 100) / 100, // Round to 2 decimal places
      recentSavedWords: recentSavedWords.map(word => ({
        id: word.id,
        word: word.word,
        meaning: word.meaning,
        notes: word.notes,
        createdAt: word.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}