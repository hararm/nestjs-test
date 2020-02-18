import * as mongoose from 'mongoose';
export const GroupSchema = new mongoose.Schema({
    name: String,
    image: {type: String, default: 'default.png'},
    members: [{userName: { type: String, default: ''}}]
});
