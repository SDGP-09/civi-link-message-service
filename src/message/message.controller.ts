import {Body, Controller, HttpCode, Post, UseGuards} from '@nestjs/common';
import {UserJwtGuard} from "../auth/guard";
import {GetUser} from "../auth/decorator";
import {SendMessageDto} from "./MessageDTO";
import {MessageService} from "./message.service";

@Controller('message')
export class MessageController {

    constructor(private messageService: MessageService){}


    @UseGuards(UserJwtGuard)
    @Post('sendMessage')
    @HttpCode(200)
    sendMessage(@GetUser() user, @Body() data: SendMessageDto) {
        const { message, conversationId, attachments, reference } = data;


        if (!attachments && reference === undefined) {
            return this.messageService.sendMessage(message, conversationId);
        }


        if (attachments && reference === undefined) {
            return this.messageService.sendMessage(message, conversationId, attachments);
        }


        if (!attachments && reference !== undefined) {
            return this.messageService.sendMessage(message, conversationId, undefined, reference);
        }


        return this.messageService.sendMessage(message, conversationId, attachments, reference);
    }
}
