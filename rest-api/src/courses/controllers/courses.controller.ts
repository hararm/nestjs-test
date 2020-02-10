import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    Param,
    Post,
    Put,
    UseFilters,
} from '@nestjs/common';

import {findAllCourses} from '../../../db-data';
import {CoursesRepository} from '../courses.repository';
import {HttpExceptionFilter} from '../../filters/http.filter';
import {Course} from '../models/course.model';
import {ToIntegerPipe} from '../../pipes/to-integer.pipe';

@Controller('courses')
// @UseFilters( new HttpExceptionFilter())
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
                       @Body('seqNo', ToIntegerPipe)
                       @Body() changes: Partial<Course>): Promise<Course> {
        if (changes._id) {
            throw new BadRequestException('Can\'t update course id');
        }
        return this.coursesRepository.updateCourse(courseId, changes);
    }

    @Delete(':courseId')
    async deleteCourse(@Param('courseId') courseId: string) {
        return this.coursesRepository.deleteCourse(courseId);
    }
}
