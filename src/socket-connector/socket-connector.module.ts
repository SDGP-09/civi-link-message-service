import {forwardRef, Module} from '@nestjs/common';
import {ConversationModule} from "../conversation/conversation.module";
import {SocketGateway} from "./socket-gateway";
import {UserWsJwtGuard} from "../auth/guard";

@Module({
    imports:[forwardRef(() => ConversationModule)],
    providers:[SocketGateway, UserWsJwtGuard],
    exports: [SocketGateway],
})
export class SocketConnectorModule {}
