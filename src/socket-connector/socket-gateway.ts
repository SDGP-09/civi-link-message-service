import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection, OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway
} from "@nestjs/websockets";
import {Socket} from 'socket.io';
import {Injectable, UseFilters, UseGuards} from "@nestjs/common";
import {UserWsJwtGuard} from "../auth/guard";
import {ConversationService} from "../conversation/conversation.service";
import * as jwt from 'jsonwebtoken';
import {ConversationInterface} from "../conversation/interfaces";
import {Conversation, Message} from "@prisma/client";
import {ConversationsInitDto, MoreMessagesDto, SortConversationDto} from "./socketDTO";
import {WsHttpExceptionFilter} from "./filter";

@Injectable()
@WebSocketGateway(3002, {cors: {origin: '*'}})
@UseGuards(UserWsJwtGuard)
@UseFilters(WsHttpExceptionFilter)
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect{

    constructor(private conversation: ConversationService){}

    private onlineUsers: Map<string, Socket> = new Map();

    async handleConnection(client: Socket) {
        // console.log(client.data);

        const token: string = client.handshake.auth.token as string;

        //External API call to validate
        const validated: boolean = true;

        if (validated){
            const payload = jwt.decode(token)?.sub;
            // console.log(payload);
            // client.emit('conversations', 'You are safe');
            if(typeof payload === "string") {
                this.onlineUsers.set(payload, client);

            }
        } else {
            client.disconnect(true);
        }




        // console.log(this.onlineUsers);
        client.emit('conversations', "Connected");
    }



    @SubscribeMessage('GetConversationsInit')
    async getConversationsInit(@MessageBody() body: ConversationsInitDto, @ConnectedSocket() client: Socket){
        console.log('something happen');
        const conversations: ConversationInterface[] =await this.conversation.retrieveAllConversations(client.data.user.userid);
        // console.log(client.data.user.userid);
        client.emit('conversations', conversations);
    }

    //Mind that newMessage2 and the conversation2 should be provided
    sendMessage(conversation: Conversation,  message: Message){
        if (this.onlineUsers.has(conversation.sender)){
            const client: Socket = this.onlineUsers.get(conversation.sender) as Socket;
            //from the message client will have information that is enough to say whether the conversation
            //list must get sorted
            client.emit("message", message);


        }


    }


    // refine a bit
    @SubscribeMessage('GetSortedConversations')
    async getSortedConversations(@MessageBody() body: SortConversationDto, @ConnectedSocket() client: Socket){

        let conversations: ConversationInterface[];
        if(body.flag === true){
            conversations = await this.conversation.retrieveAllConversations(client.data.user.userid, body.last, body.flag);

        }else if (body.flag !== undefined){
            conversations =await this.conversation.retrieveAllConversations(client.data.user.userid, body.last);
        } else {
            conversations = await this.conversation.retrieveAllConversations(client.data.user.userid);
        }


        client.emit('conversations', conversations);

    }


    @SubscribeMessage('GetMoreMessages')
    async getMoreMessages(@MessageBody() body: MoreMessagesDto, @ConnectedSocket() client: Socket){
        const messages = await this.conversation.loadConversation(client.data.user.userid, body.last);


        client.emit("moreMessages", messages);
    }




    handleDisconnect(client: Socket) {
        const token: string = client.handshake.auth.token as string;
        const payload = jwt.decode(token)?.sub;

        if (typeof payload == 'string') {
            if (this.onlineUsers.has(payload)){
                this.onlineUsers.delete(payload);
            }
        }
        // console.log(this.onlineUsers);

    }








}