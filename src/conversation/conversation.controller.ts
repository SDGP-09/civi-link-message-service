import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {GetUser} from "../auth/decorator";
import {UserJwtGuard} from "../auth/guard/userJwt.guard";
import {UserDto} from "./ConversationDTO";
import {ConversationService} from "./conversation.service";

@Controller('conversation')
export class ConversationController {

    constructor(private conversationService: ConversationService){}

    @UseGuards(UserJwtGuard)
    @Post('create')
    create(@GetUser() user, @Body() data: UserDto){

        const sender:string = user.userid;
        const recipient:string = data.recipient;

        console.log(sender);

         return this.conversationService.addConversation(sender, recipient);
    }
}
