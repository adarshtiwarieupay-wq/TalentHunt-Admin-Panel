import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITestSession extends Document {
  candidateId: mongoose.Types.ObjectId;
  startTime: Date;
  submissionTime?: Date;
  answers: { questionId: string; selectedOption: string }[];
  score?: number;
  passed?: boolean;
}

const TestSessionSchema: Schema = new Schema({
  candidateId: { type: Schema.Types.ObjectId, ref: 'Candidate', required: true },
  startTime: { type: Date, required: true },
  submissionTime: { type: Date },
  answers: [{
    questionId: { type: String, required: true },
    selectedOption: { type: String, required: true }
  }],
  score: { type: Number },
  passed: { type: Boolean },
});

const TestSession: Model<ITestSession> = mongoose.models.TestSession || mongoose.model<ITestSession>('TestSession', TestSessionSchema);

export default TestSession;
