import { Module } from '@nestjs/common';
import {ConversationModule} from "../conversation/conversation.module";
import {SocketGateway} from "./socket-gateway";
import {UserWsJwtGuard} from "../auth/guard";

@Module({
    imports:[ConversationModule],
    providers:[SocketGateway, UserWsJwtGuard]
})
export class SocketConnectorModule {}
