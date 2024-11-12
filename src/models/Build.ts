import mongoose, { Schema, Document } from 'mongoose';

interface IBuild extends Document {
  id: string;
  status: string;
  source: object;
  createTime: string;
  startTime: string;
  finishTime: string;
  projectId: string;
  logsBucket: string;
  sourceProvenance: object;
  buildTriggerId: string;
  options: object;
  logUrl: string;
  substitutions: object;
  tags: string[];
  timing: object;
  name: string;
}

const BuildSchema: Schema = new Schema({
  id: { type: String, required: true },
  status: { type: String, required: true },
  source: { type: Object, required: true },
  createTime: { type: String, required: true },
  startTime: { type: String, required: false },
  finishTime: { type: String, required: false },
  projectId: { type: String, required: true },
  logsBucket: { type: String, required: true },
  sourceProvenance: { type: Object, required: true },
  buildTriggerId: { type: String, required: true },
  options: { type: Object, required: true },
  logUrl: { type: String, required: true },
  substitutions: { type: Object, required: true },
  tags: { type: [String], required: true },
  timing: { type: Object, required: false },
  name: { type: String, required: true },
});

export default mongoose.model<IBuild>('Build', BuildSchema);