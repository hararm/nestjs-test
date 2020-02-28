import {Injectable, Logger} from '@nestjs/common';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {Group} from '../models/group.model';
import {User} from '../models/user.model';

@Injectable()
export class UserRepository {
    private logger = new Logger('UserRepository');
    constructor(@InjectModel('Group') private groupModel: Model<Group>,
                @InjectModel('User') private userModel: Model<User>) {

    }

    async findAll(): Promise<User[]> {
        this.logger.debug('Find All Users');
        return this.userModel.find();
    }
}
