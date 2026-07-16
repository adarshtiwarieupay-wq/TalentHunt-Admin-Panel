import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Candidate from '@/models/Candidate';
import TestSession from '@/models/TestSession';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();

    // Fetch all candidates
    const candidates = await Candidate.find({}).lean();
    
    // Fetch all test sessions
    const sessions = await TestSession.find({}).lean();

    const leaderboard = candidates.map(candidate => {
      const session = sessions.find(s => s.candidateId.toString() === candidate._id.toString());
      
      let status = 'Not Started';
      if (candidate.hasCompleted) status = 'Completed';
      else if (candidate.hasStarted) status = 'In Progress';

      return {
        id: candidate._id.toString(),
        name: candidate.name,
        email: candidate.email,
        score: session?.score ?? 0,
        status,
        startTime: session?.startTime,
        submissionTime: session?.submissionTime
      };
    });

    // Sort by score descending
    leaderboard.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // If tied, whoever submitted faster wins (if they both submitted)
      if (a.submissionTime && b.submissionTime && a.startTime && b.startTime) {
         const aDuration = new Date(a.submissionTime).getTime() - new Date(a.startTime).getTime();
         const bDuration = new Date(b.submissionTime).getTime() - new Date(b.startTime).getTime();
         return aDuration - bDuration;
      }
      return 0;
    });

    return NextResponse.json({ leaderboard });
  } catch (error: any) {
    console.error('Leaderboard fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
