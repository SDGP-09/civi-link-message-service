import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import {ConfigModule} from "@nestjs/config";
import { MessageModule } from './message/message.module';
import { ConversationModule } from './conversation/conversation.module';
import { AttachmentModule } from './attachment/attachment.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }), MessageModule, ConversationModule, AttachmentModule, AuthModule],
  controllers: []
})
export class AppModule {}
