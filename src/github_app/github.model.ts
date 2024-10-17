import { model, Schema, Document } from 'mongoose';
import { Github } from '@/github_app/github.interface';


const githubSchema: Schema = new Schema({
  user: {
    type: String,
    required: true,
    unique: true,
  },
  installation: {
    type: Number,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
    unique: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  scope: {
    type: String,

  },
  tokenType: {
    type: String,
    required: true,
  },
  accessTokenExpiresAt: {
    type: Date,
    required: true,
  },
  refreshTokenExpiresAt: {
    type: Date,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
});

const githubModel = model<Github & Document>('Github', githubSchema);

export default githubModel;
