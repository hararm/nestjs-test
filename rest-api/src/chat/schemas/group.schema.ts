import * as mongoose from 'mongoose';
import {MemberSchema} from './member.schema';

export const GroupSchema = new mongoose.Schema({
    groupName: {type: String,  required: true},
    clinicName: {type: String, default: ''},
    image: {type: String, default: 'default.png'},
    members: [MemberSchema]
});
