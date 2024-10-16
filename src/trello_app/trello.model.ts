
import { Github } from '@/github_app/github.interface';
import { Schema,model, Document } from 'mongoose';
import Trello from './trello.interface';

const trelloSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    accessToken: {
        type: String,
        required: true,
        unique: true,
    },
    accessTokenSecret: {
        type: String,
        required: true,
    }
});

const trelloModel = model<Trello & Document>('Trello', trelloSchema);

export default trelloModel;
