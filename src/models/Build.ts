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
  source: { type: Object, required: false },
  createTime: { type: String, required: true },
  startTime: { type: String, required: false },
  finishTime: { type: String, required: false },
  projectId: { type: String, required: true },
  logsBucket: { type: String, required: false },
  sourceProvenance: { type: Object, required: false },
  buildTriggerId: { type: String, required: false },
  options: { type: Object, required: false },
  logUrl: { type: String, required: true },
  substitutions: { type: Object, required: false },
  tags: { type: [String], required: true },
  timing: { type: Object, required: false },
  name: { type: String, required: false },
});

export default mongoose.model<IBuild>('Build', BuildSchema);