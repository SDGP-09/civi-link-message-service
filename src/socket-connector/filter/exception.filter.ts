import { Catch, ArgumentsHost, WsExceptionFilter, HttpException } from '@nestjs/common';
import { Socket } from 'socket.io';

@Catch(HttpException)
export class WsHttpExceptionFilter implements WsExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        // switch to WS context
        const ctx = host.switchToWs();
        const client: Socket = ctx.getClient<Socket>();

        // extract error info from the thrown exception
        const status = exception.getStatus();        // 403, 404
        const response = exception.getResponse();    //{ statusCode: 403, message: 'Forbidden' }

        // emit an event back to the client with the error details
        client.emit('exception', {
            statusCode: status,
            error: typeof response === 'string' ? response : (response as any).message,
        });
    }
}