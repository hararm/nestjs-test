import {BadRequestException, Controller, Get, ParseIntPipe, Query} from '@nestjs/common';
import {LessonsRepository} from '../repositories/lesons.repository';

@Controller('lessons')
export class LessonsController {
    constructor(private lessonsRepository: LessonsRepository) {
    }
    @Get()
    searchLessons(
        @Query('courseId') courseId: string,
        @Query('sortOrder') sortOrder = 'asc',
        @Query('pageNumber', ParseIntPipe) pageNumber = 0,
        @Query('pageSize', ParseIntPipe) pageSize = 3,
    ) {
        if (!courseId) {
            throw new BadRequestException('courseId must be defined');
        }

        if (sortOrder !== 'asc' && sortOrder !== 'desc') {
            throw new BadRequestException('sortOrder must be asc or desc');
        }

        return this.lessonsRepository.search(courseId, sortOrder, pageNumber, pageSize);
    }
}
