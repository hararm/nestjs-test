import {Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {Group} from '../models/group.model';

@Injectable()
export class GroupRepository {
    constructor(@InjectModel('Group') private groupModel: Model<Group>) {

    }

    async addGroup(data: any): Promise<Group> {

        // another way of creating a model, when we want to save it immediately
        // const result = await this.courseModel.create(course);

        // this allows to manipulate the model in memory, before saving it
        /*const newGroup = this.groupModel(group);
        await newGroup.save();
        return newGroup.toObject({versionKey: false});*/

        return new Group();
    }

    async findAll(): Promise<Group[]> {
        return this.groupModel.find();
    }

    async findGroupByName(groupName: string): Promise<Group> {
        return this.groupModel.findOne({name: groupName});
    }

    async updateGroup(groupId: string, changes: Partial<Group>): Promise<Group> {
        return this.groupModel.findOneAndUpdate({_id: groupId}, changes, {new: true});
    }

    deleteGroup(groupId: string) {
        return this.groupModel.deleteOne({_id: groupId});
    }

}
