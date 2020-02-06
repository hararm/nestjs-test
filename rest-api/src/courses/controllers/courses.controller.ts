import {Controller, Get} from '@nestjs/common';
import {Course} from '../../../../shared/course';
import {findAllCourses} from '../../../db-data';

@Controller()
export class CoursesController {
    // tslint:disable-next-line:no-empty
    constructor() {
    }

    @Get('/api/courses')
    async findAllCourses(): Promise<Course[]> {
        return findAllCourses();
    }
}
