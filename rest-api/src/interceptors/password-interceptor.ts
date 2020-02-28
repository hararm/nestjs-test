import {CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor} from '@nestjs/common';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {User} from '../chat/models/user.model';

@Injectable()
export class PasswordInterceptor implements NestInterceptor {
    private logger = new Logger('NestInterceptor');
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next
            .handle()
            .pipe(
                map((data: User[]) => {
                    data.forEach( (element, index, array) => {
                        array[index].passwordHash = undefined;
                    });
                    this.logger.debug(`PasswordInterceptor ${JSON.stringify(data)}`);
                    return data;
                })
            );
    }
}
