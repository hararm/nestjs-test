import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {CoursesModule} from './courses/courses.module';
import {MongooseModule} from '@nestjs/mongoose';
import {MONGO_CONNECTION} from './constants';
import {AuthModule} from './auth/auth.module';
import {GetUserMiddleware} from './middleware/get-user.middleware';
import {CoursesController} from './courses/controllers/courses.controller';
import {LessonsController} from './courses/controllers/lessons.controller';
import {ChatModule} from './chat/chat.module';
import {MulterModule} from '@nestjs/platform-express';
import {AppGateway} from './app.gateway';

@Module({
    imports: [
        AuthModule,
        ChatModule,
        CoursesModule,
        MulterModule.register({
            dest: './files',
        }),
        MongooseModule.forRoot(MONGO_CONNECTION)],
    providers: [AppGateway],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
        consumer
            .apply(GetUserMiddleware)
            .forRoutes(
                CoursesController,
                LessonsController
            );

    }
}
