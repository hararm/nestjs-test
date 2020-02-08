import {Body, Controller, Get, Param, Put} from '@nestjs/common';
import {Course} from '../../../../shared/course';
import {findAllCourses} from '../../../db-data';
import {CoursesRepository} from '../courses.repository';

@Controller('courses')
export class CoursesController {
    // tslint:disable-next-line:no-empty
    constructor(private coursesRepository: CoursesRepository) {
    }

    @Get()
    async findAllCourses(): Promise<Course[]> {
        return this.coursesRepository.findAll();
    }

    @Put(':courseId')
    async updateCourse(@Param('courseId') courseId: string,
                       @Body() changes: Partial<Course>): Promise<Course> {
        return this.coursesRepository.updateCourse(courseId, changes);

    }
}
