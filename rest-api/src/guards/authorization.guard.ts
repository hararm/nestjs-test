import {CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger} from '@nestjs/common';

@Injectable()
export class AuthorizationGuard implements CanActivate {
    private logger = new Logger('AuthenticationGuard');

    constructor(private allowedRoles: string[]) {
    }

    canActivate(context: ExecutionContext): boolean {
        const host = context.switchToHttp();
        const request = host.getRequest();

        const user = request['user'];
        const allowed = this.isAllowed(user.roles);

        if (!allowed) {
            this.logger.error(`User is authenticated but not authorized, denying access...`);
            throw new ForbiddenException();
        }
        this.logger.verbose('User is authorized, allowing access');
        return true;
    }

    isAllowed(userRoles: string[]) {
        this.logger.debug(`Comparing roles: ${JSON.stringify(this.allowedRoles)} ${JSON.stringify(userRoles)}`);
        let allowed = false;
        userRoles.forEach(userRole => {
            this.logger.debug(`Checking if role is allowed ${userRole}`);
            if (!allowed && this.allowedRoles.includes(userRole)) {
                allowed = true;
            }
        });
        return allowed;
    }

}
