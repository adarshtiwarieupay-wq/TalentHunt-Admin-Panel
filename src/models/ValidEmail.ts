import mongoose, { Schema, Document } from 'mongoose';

export interface IValidEmail extends Document {
  email: string;
}

const ValidEmailSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
});

export default mongoose.models.ValidEmail || mongoose.model<IValidEmail>('ValidEmail', ValidEmailSchema);
