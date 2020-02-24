import * as mongoose from 'mongoose';
import {UsersSchema} from '../../auth/schemas/users.schema';

export const GroupSchema = new mongoose.Schema({
    groupName: {type: String,  required: true},
    clinicName: {type: String, default: ''},
    image: {type: String, default: 'default.png'},
    members: [UsersSchema]
});
