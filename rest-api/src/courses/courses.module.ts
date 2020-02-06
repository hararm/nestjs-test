import {Module} from '@nestjs/common';
import {CoursesController} from './controllers/courses.controller';
import {MongooseModule} from '@nestjs/mongoose';
import {CoursesSchema} from './courses.schema';
import {CoursesRepository} from './courses.repository';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'Course', schema: CoursesSchema},
        ]),
    ],
    controllers: [
        CoursesController,
    ],
    providers: [
        CoursesRepository,
    ],
})
export class CoursesModule {

}
