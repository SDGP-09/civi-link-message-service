import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import {Attachment} from "@prisma/client";
import {PrismaService} from "../prisma/prisma.service";
import {PrismaModule} from "../prisma/prisma.module";
import {AttachmentModule} from "../attachment/attachment.module";

@Module({
  imports: [PrismaModule, AttachmentModule],
  controllers: [MessageController],
  providers: [MessageService]
})
export class MessageModule {}
