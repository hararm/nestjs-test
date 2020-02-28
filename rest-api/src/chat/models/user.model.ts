import {IUser} from '../../../../shared/user';
import {IsMongoId, IsString} from 'class-validator';

export class User implements IUser {
    @IsString()
    @IsMongoId()
    _id: string;
    @IsString()
    email: string;
    @IsString()
    passwordHash: string;
}
