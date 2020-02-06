import { Module } from '@nestjs/common';
import {CoursesController} from './courses/controllers/courses.controller';

@Module({
  imports: [],
  controllers: [CoursesController],
  providers: [],
})
export class AppModule {}
