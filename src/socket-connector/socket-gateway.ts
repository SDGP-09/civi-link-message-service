import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway
} from "@nestjs/websockets";
import {Socket} from 'socket.io';
import {Injectable, UseGuards} from "@nestjs/common";
import {UserWsJwtGuard} from "../auth/guard";
import {ConversationService} from "../conversation/conversation.service";
import * as jwt from 'jsonwebtoken';
import {ConversationInterface} from "../conversation/interfaces";

@Injectable()
@WebSocketGateway(3002, {cors: {origin: '*'}})
@UseGuards(UserWsJwtGuard)
export class SocketGateway implements OnGatewayConnection{

    constructor(private conversation: ConversationService){}



    async handleConnection(client: Socket) {
        // console.log(client.data);

        const token: string = client.handshake.auth.token as string;

        //External API call to validate
        const validated: boolean = true;

        if (validated){
            const payload = jwt.decode(token)?.sub;
            // console.log(payload);
        }





        client.emit('conversations', "Connected");
    }

    @SubscribeMessage('GetConversationsInit')
    async getConversationsInit(@MessageBody() body: any, @ConnectedSocket() client: Socket){
        console.log('something happen');
        const conversations: ConversationInterface[] =await this.conversation.retrieveAllConversations(client.data.user.userid);
        // console.log(client.data.user.userid);
        client.emit('conversations', conversations);
    }








}