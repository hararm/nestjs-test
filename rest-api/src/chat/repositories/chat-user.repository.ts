import {Injectable, Logger} from '@nestjs/common';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {ChatUser} from '../models/chat-user.model';
import {Group} from '../models/group.model';

@Injectable()
export class ChatUserRepository {
    private logger = new Logger('ChatUserRepository');
    constructor(@InjectModel('ChatUser') private userModel: Model<ChatUser>,
                @InjectModel('Group') private groupModel: Model<Group>) {

    }

    async findAll(): Promise<ChatUser[]> {
        return this.userModel.find();
    }

    async findUsersByGroupId(groupId: string): Promise<ChatUser[]> {
        const query =  this.groupModel.findOne({_id: groupId}, 'memebers');
        return query.exec();
    }
}
