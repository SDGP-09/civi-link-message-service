-- AlterTable
ALTER TABLE `conversation` MODIFY `lastMessage` VARCHAR(191) NULL,
    MODIFY `unseenCount` INTEGER NOT NULL DEFAULT 0;
