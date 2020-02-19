import * as mongoose from 'mongoose';
export const GroupSchema = new mongoose.Schema({
    groupName: {type: String, default: ''},
    image: {type: String, default: 'default.png'},
    members: [{userName: { type: String, default: ''}}]
});
