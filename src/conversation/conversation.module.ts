import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import {PrismaModule} from "../prisma/prisma.module";
import {AttachmentModule} from "../attachment/attachment.module";
import {MessageModule} from "../message/message.module";

@Module({
  imports: [PrismaModule, MessageModule],
  controllers: [ConversationController],
  providers: [ConversationService, AttachmentModule],
  exports: [ConversationService],
})
export class ConversationModule {}
