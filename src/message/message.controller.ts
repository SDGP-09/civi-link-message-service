import {Body, Controller, HttpCode, Post, UploadedFiles, UseGuards, UseInterceptors} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {UserJwtGuard} from "../auth/guard";
import {GetUser} from "../auth/decorator";
import {SendMessageDto} from "./MessageDTO";
import {MessageService} from "./message.service";

@Controller('message')
export class MessageController {

    constructor(private messageService: MessageService){}


    @UseGuards(UserJwtGuard)
    @Post('sendMessage')
    @UseInterceptors(FilesInterceptor('attachments'))
    @HttpCode(200)
    sendMessage(@GetUser() user, @Body() data: SendMessageDto, @UploadedFiles() files: Express.Multer.File[]) {
        const { message, conversationId, reference } = data;



        if (!files.length && reference === undefined) {
            return this.messageService.sendMessage(message, conversationId);
        }


        if (files.length && reference === undefined) {
            return this.messageService.sendMessage(message, conversationId, files);
        }


        if (!files.length && reference !== undefined) {
            return this.messageService.sendMessage(message, conversationId, undefined, reference);
        }


        return this.messageService.sendMessage(message, conversationId, files, reference);
    }
}
