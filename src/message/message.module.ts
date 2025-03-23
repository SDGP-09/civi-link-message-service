import {forwardRef, Module} from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import {Attachment} from "@prisma/client";
import {PrismaService} from "../prisma/prisma.service";
import {PrismaModule} from "../prisma/prisma.module";
import {AttachmentModule} from "../attachment/attachment.module";
import {SocketConnectorModule} from "../socket-connector/socket-connector.module";
import {StorageModule} from "../storage/storage.module";

@Module({
  imports: [PrismaModule, AttachmentModule, forwardRef(() => SocketConnectorModule), StorageModule],
  controllers: [MessageController],
  providers: [MessageService]
})
export class MessageModule {}
