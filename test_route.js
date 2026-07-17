const mongoose = require('mongoose');

const MONGODB_URI="mongodb+srv://adarshtiwarieupay_db_user:sLx31zWqLgxtgIb5@cluster0.zaozicx.mongodb.net/quiz?retryWrites=true&w=majority";

async function main() {
  await mongoose.connect(MONGODB_URI);
  
  const TestSession = mongoose.model('TestSession', new mongoose.Schema({
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' },
    startTime: Date,
    submissionTime: Date,
    score: Number,
  }, { collection: 'testsessions' }));
  
  const Candidate = mongoose.model('Candidate', new mongoose.Schema({
    name: String,
    email: String,
  }, { collection: 'candidates' }));
  
  const candidates = await Candidate.find({}).lean();
  const sessions = await TestSession.find({}).lean();

  const leaderboard = candidates.map(candidate => {
    const session = sessions.find(s => s.candidateId.toString() === candidate._id.toString());
    return {
      name: candidate.name,
      candidate_id_type: typeof candidate._id,
      session_found: !!session,
      session_score: session?.score,
    };
  });
  
  console.log(JSON.stringify(leaderboard, null, 2));

  process.exit(0);
}

main().catch(console.error);
