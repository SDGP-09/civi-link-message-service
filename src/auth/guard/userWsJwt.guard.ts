import {AuthGuard} from "@nestjs/passport";
import {ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Socket} from "socket.io";

@Injectable()
export class UserWsJwtGuard extends AuthGuard('conversationJwt'){


    getRequest(context: ExecutionContext){
        const client: Socket = context.switchToWs().getClient();
        // console.log('GUARD: handshake.auth:', client.handshake.auth);
        const token: string = client.handshake.auth.token as string;
        // console.log('GUARD: extracted token:', token);

        return {
            headers: {
                authorization: `Bearer ${token}`,
            },
        };
    }


    handleRequest(err, user, info, context: ExecutionContext){
        // console.log('GUARD: handleRequest. err=', err, ' user=', user);
        if(err || (!user)){
            throw err || new UnauthorizedException();
        }

        const client: Socket = context.switchToWs().getClient();
        client.data.user = user;

        return user;
    }

}