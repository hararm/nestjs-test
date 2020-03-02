import * as mongoose from 'mongoose';

export const GroupSchema = new mongoose.Schema({
    groupName: {type: String,  required: true},
    clinicName: {type: String, default: ''},
    image: {type: String, default: 'default.png'},
    isPrivate: {type: Boolean, default: false},
    members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});
