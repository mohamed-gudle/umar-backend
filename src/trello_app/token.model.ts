import { model, Schema, Document } from 'mongoose';
import OAuthRequestToken from './token.interface';

const requestTokenSchema: Schema = new Schema({
    
    requestToken: {
        type: String,
        required: true,
        unique: true,
    },
    requestTokenSecret: {
        type: String,
        required: true,
    },
});

const requestTokenModel = model<OAuthRequestToken & Document>('RequestToken', requestTokenSchema);

export default requestTokenModel;

