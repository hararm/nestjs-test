import {CanActivate, ExecutionContext, Injectable, Logger} from '@nestjs/common';

import * as jwt from 'jsonwebtoken';
import {WsException} from '@nestjs/websockets';
import {JWT_SECRET} from '../constants';

@Injectable()
export class WsJwtGuard implements CanActivate {

    private logger = new Logger('WsJwtGuard');

    canActivate(context: ExecutionContext): boolean {
        const client = context.switchToWs().getClient();
        const authJwtToken = client.handshake.query['authJwtToken'];
        this.logger.verbose(authJwtToken);
        if (typeof authJwtToken === 'undefined') {
            throw new WsException('authJwtToken');
        }
        const user = jwt.verify(authJwtToken, JWT_SECRET);
        if (user) {
            this.logger.verbose(`WsJwtGuard found user details in JWT:  ${JSON.stringify(user)}`);
            return true;
        }
        return false;
    }
}
