/*
  Warnings:

  - Added the required column `lastMessage` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unseenCount` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `conversation` ADD COLUMN `lastMessage` VARCHAR(191) NOT NULL,
    ADD COLUMN `unseenCount` INTEGER NOT NULL;
