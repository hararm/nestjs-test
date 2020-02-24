import {Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {ChatMessage} from '../models/chat.message.model';

@Injectable()
export class MessagesRepository {
    constructor(@InjectModel('ChatMessage') private messageModel: Model<ChatMessage>) {

    }

    async addMessage(message: any): Promise<ChatMessage> {
        const newMessage = this.messageModel(message);
        await newMessage.save();
        return newMessage.toObject({versionKey: false});
    }

    async findMessagesByGroupId(id: string): Promise<ChatMessage> {
        return this.messageModel.findOne({_id: id});
    }

    async deleteMessage(id: string) {
        return this.messageModel.deleteOne({_id: id});
    }
}
