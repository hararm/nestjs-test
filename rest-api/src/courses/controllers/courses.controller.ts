import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpException, Logger, NotFoundException,
    Param,
    Post,
    Put,
    UseFilters,
} from '@nestjs/common';

import {findAllCourses} from '../../../db-data';
import {CoursesRepository} from '../repositories/courses.repository';
import {HttpExceptionFilter} from '../../filters/http.filter';
import {Course} from '../models/course.model';
import {ToIntegerPipe} from '../../pipes/to-integer.pipe';

@Controller('courses')
// @UseFilters( new HttpExceptionFilter())
export class CoursesController {
    private logger = new Logger('CoursesController');
    // tslint:disable-next-line:no-empty
    constructor(private coursesRepository: CoursesRepository) {
    }

    @Post()
    async createCourse(@Body() course: Course): Promise<Course> {
        return this.coursesRepository.addCourse(course);
    }

    @Get()
    async findAllCourses(): Promise<Course[]> {
        this.logger.verbose(`Retrieving all courses`);
        return this.coursesRepository.findAll();
    }

    @Get(':courseUrl')
    async findCourseByUrl(@Param('courseUrl') courseUrl: string) {
        const course = await this.coursesRepository.findCourseByUrl(courseUrl);
        if (!course) {
            throw new NotFoundException('Could not find course for url ' + courseUrl);
        }
        return course;
    }

    @Put(':courseId')
    async updateCourse(@Param('courseId') courseId: string,
                       @Body() changes: Course): Promise<Course> {
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
