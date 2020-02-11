import {Injectable} from '@nestjs/common';
import {Lesson} from '../../../../shared/lesson';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

@Injectable()
export class LessonsRepository {

    constructor(@InjectModel('Lesson') private lessonsModel: Model<Lesson>) {
    }
    search(courseId: string, sortOrder: string, pageNumber: number, pageSize: number) {
        return this.lessonsModel.find({
           course: courseId
        }, null, {
            skip: pageNumber * pageSize,
            limit: pageSize,
            sort: {
                seqNo: sortOrder
            }
        });
    }
}
