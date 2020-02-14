import {CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException} from '@nestjs/common';

@Injectable()
export class AuthenticationGuard implements CanActivate {
    private logger = new Logger('AuthenticationGuard');
    canActivate(context: ExecutionContext): boolean {
        const host = context.switchToHttp();
        const request = host.getRequest();
        const user = request['user'];

        if (!user) {
            this.logger.error('User not authenticated. Denying access.');
            throw new UnauthorizedException();
        }
        this.logger.verbose('User is authenticated. Allowing access.');
        return true;
    }
}
