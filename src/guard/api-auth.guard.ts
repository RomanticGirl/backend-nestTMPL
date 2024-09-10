import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';

@Injectable()
export class ApiAuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        try {
            // const token = req.headers.token;
            // if (!token) {
            //     throw new UnauthorizedException();
            // }
            // if (token !== '139eddf9a8f84768aa2fe2946cb65baa') {
            //     throw new UnauthorizedException();
            // }
            return true;
        } catch (e) {
            throw new UnauthorizedException({
                message: 'Пользователь не авторизован',
            });
        }
    }
}
