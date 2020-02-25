import * as mongoose from 'mongoose';

export const MemberSchema = new mongoose.Schema({
    userName: {type: String, required: true},
    email: {type: String},
    channelId: {type: String, required: true}
});
