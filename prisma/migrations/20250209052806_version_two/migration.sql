/*
  Warnings:

  - You are about to drop the column `owner` on the `conversation` table. All the data in the column will be lost.
  - You are about to drop the column `receiver` on the `conversation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sender,recipient]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `recipient` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Conversation_owner_receiver_key` ON `conversation`;

-- AlterTable
ALTER TABLE `conversation` DROP COLUMN `owner`,
    DROP COLUMN `receiver`,
    ADD COLUMN `recipient` VARCHAR(191) NOT NULL,
    ADD COLUMN `sender` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Conversation_sender_recipient_key` ON `Conversation`(`sender`, `recipient`);
