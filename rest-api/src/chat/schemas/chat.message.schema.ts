import * as mongoose from 'mongoose';

export const ChatMessageSchema = new mongoose.Schema({
    senderId: {type: String, required: true},
    recipientId: {type: String},
    channelId: {type: String, required: true},
    message: {type: String, required: true},
    timeStamp: {type: String, required: true},
    senderNicName: {type: String, required: true}
});
