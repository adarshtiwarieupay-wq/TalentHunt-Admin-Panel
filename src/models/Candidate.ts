import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICandidate extends Document {
  name: string;
  email: string;
  hasStarted: boolean;
  hasCompleted: boolean;
}

const CandidateSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  hasStarted: { type: Boolean, default: false },
  hasCompleted: { type: Boolean, default: false },
});

const Candidate: Model<ICandidate> = mongoose.models.Candidate || mongoose.model<ICandidate>('Candidate', CandidateSchema);

export default Candidate;
