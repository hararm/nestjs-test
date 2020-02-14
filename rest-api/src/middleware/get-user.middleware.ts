import {Injectable, Logger, NestMiddleware} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET} from '../constants';

@Injectable()
export class GetUserMiddleware implements NestMiddleware {
    private logger = new Logger('GetUserMiddleware');
    use(req: Request, res: Response, next: () => void): any {
         const authJwtToken = req.headers['authorization'];
         if (!authJwtToken) {
             next();
             return;
         }
         try {
             const user = jwt.verify(authJwtToken, JWT_SECRET);
             if (user) {
                 this.logger.verbose(`Found user details in JWT:  ${JSON.stringify(user)}`);
                 req['user'] = user;
             }
         } catch (err) {
             this.logger.error('Error handling authentication JWT: ', err);
         }
         next();
    }
}
