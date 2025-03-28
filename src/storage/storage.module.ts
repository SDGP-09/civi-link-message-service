import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import {ConfigModule} from "@nestjs/config";

@Module({
  providers: [StorageService],
  exports: [StorageService]
})
export class StorageModule {}
