import { Module } from '@nestjs/common';

import { AttachmentService } from './attachment.service';
import {PrismaModule} from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [AttachmentService],
  exports: [AttachmentService],
})
export class AttachmentModule {}
