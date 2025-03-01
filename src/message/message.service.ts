import {ForbiddenException, Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {Attachment, Conversation} from "@prisma/client";
import {MessageStructure} from "./interfaces";
import {AttachmentService} from "../attachment/attachment.service";
import {SocketGateway} from "../socket-connector/socket-gateway";

@Injectable()
export class MessageService {




    constructor(
        private prisma: PrismaService,
        private attachmentService: AttachmentService,
        private gateway: SocketGateway
    ){}


    async sendMessage(message: string, conversationId: number, attachments?: string[], reference: number = -1){

        try {
            const conversation: Conversation = await this.prisma.conversation.findUniqueOrThrow({
                where: {
                    id: conversationId,
                },

            });

            let recipientConversation = await this.prisma.conversation.findUnique({
                where: {
                    sender_recipient: {
                        sender: conversation.recipient,
                        recipient: conversation.sender,
                    },
                }
            });

            if (!recipientConversation){
                recipientConversation = await this.prisma.conversation.create({
                    data: {
                        sender: conversation.recipient,
                        recipient: conversation.sender,
                    }
                });
            }


            let query: MessageStructure = {
                data: {
                    message,
                    conversationId: conversation.id,
                },
                select:{
                    id: true,
                }
            }


            let queryTwo: MessageStructure = {
                data: {
                    message,
                    conversationId: recipientConversation.id,
                },
                select: {
                    id: true,
                }
            }


            if (reference !== -1){
                query.data.reference = reference;
            }


            try {
                const newMessage =await this.prisma.message.create(query);



                queryTwo.data.correspondingId = newMessage.id;

                const newMessageTwo = await this.prisma.message.create(query);

                await this.prisma.message.update({
                    where: {
                        id: newMessage.id,
                    },
                    data: {
                        correspondingId: newMessageTwo.id,
                    }
                });


                if (attachments) {
                    try {
                        await this.attachmentService.attachAll(newMessage.id, attachments);
                        await this.attachmentService.attachAll(newMessageTwo.id, attachments);
                    } catch (CreatingAttachmentError){
                        // suggest an error
                    }
                }
                await this.prisma.$executeRaw`
                UPDATE Conversation 
                SET updatedAt = NOW() 
                WHERE id IN (${conversationId}, ${recipientConversation.id})`;

                this.prisma.conversation.update({
                    where: {
                        id: conversationId,
                    },
                    data: {
                        unseenCount: conversation.unseenCount + 1,
                        lastMessage: message,
                    }
                });

                this.prisma.conversation.update({
                    where: {
                        id: recipientConversation.id,
                    },
                    data: {
                        unseenCount: conversation.unseenCount + 1,
                        lastMessage: message,
                    }
                })



                this.gateway.sendMessage(recipientConversation, newMessageTwo);





            }catch (CreationError){
                // suggest an error62
            }






        }catch (error){
            // Suggest a suitable error...
            throw new ForbiddenException();

        }




    }








}
