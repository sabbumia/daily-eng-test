// app/api/tests/all/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { dailyTests, userTestAttempts, users } from '@/db/schema';
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
      .orderBy(desc(dailyTests.testDate));

    // Get all user's test attempts
    const userAttempts = await db
      .select()
      .from(userTestAttempts)
      .where(eq(userTestAttempts.userId, auth.userId));

    // Create a map of test attempts
    const attemptsMap = new Map(
      userAttempts.map(attempt => [attempt.testId, attempt])
    );

    // Build test details array
    const testDetails = allTests.map(test => {
      const attempt = attemptsMap.get(test.id);
      const words = JSON.parse(test.words);
      
      return {
        id: test.id,
        date: test.testDate,
        completed: attempt?.completed || false,
        score: attempt?.score || 0,
        totalWords: words.length,
        attemptedAt: attempt?.attemptedAt,
      };
    });

    // Calculate statistics
    const completedAttempts = userAttempts.filter(a => a.completed);
    const totalAttempts = completedAttempts.length;
    const averageScore = totalAttempts > 0
      ? completedAttempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts
      : 0;
    const highestScore = totalAttempts > 0
      ? Math.max(...completedAttempts.map(a => a.score))
      : 0;
    const lowestScore = totalAttempts > 0
      ? Math.min(...completedAttempts.map(a => a.score))
      : 0;
    const completionRate = allTests.length > 0
      ? (totalAttempts / allTests.length) * 100
      : 0;

    return NextResponse.json({
      tests: testDetails,
      stats: {
        totalAttempts,
        averageScore: Math.round(averageScore * 100) / 100,
        highestScore,
        lowestScore,
        completionRate: Math.round(completionRate * 100) / 100,
      },
    });
  } catch (error) {
    console.error('Error fetching tests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tests' },
      { status: 500 }
    );
  }
}