import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {Course} from '../../../../shared/course';
import {findAllCourses} from '../../../db-data';
import {CoursesRepository} from '../courses.repository';

@Controller('courses')
export class CoursesController {
    // tslint:disable-next-line:no-empty
    constructor(private coursesRepository: CoursesRepository) {
    }

    @Post()
    async createCourse(@Body() course: Partial<Course>): Promise<Course> {
        return this.coursesRepository.addCourse(course);
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

    @Delete(':courseId')
    async deleteCourse(@Param('courseId') courseId: string) {
        return this.coursesRepository.deleteCourse(courseId);
    }
}
