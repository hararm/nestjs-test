import * as mongoose from 'mongoose';
import * as mongooseHidden from 'mongoose-hidden';

export const UsersSchema = new mongoose.Schema({
    email: {type: String, Required: true},
    roles: { type: Array, Required: true},
    passwordHash: {type: String, hide: true}
}).plugin(mongooseHidden,  { hidden: {passwordHash: true }});
