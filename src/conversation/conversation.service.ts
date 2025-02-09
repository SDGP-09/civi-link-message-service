import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";

import {PrismaClientKnownRequestError} from '@prisma/client/runtime/library';

@Injectable()
export class ConversationService {

    constructor(private prisma: PrismaService){}

    async addConversation(sender: string, recipient: string){
        try{
            console.log("Service reached");
            const conversationId: {id: number} = await this.prisma.conversation.create({
                data:{
                    sender: sender,
                    recipient: recipient,
                },
                select: {
                    id: true,
                }
            });
            console.log(conversationId);

            if (conversationId){
                return conversationId.id;
            }

        }catch (error){
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code === 'P2002'){
                    try{
                        const existingId = await this.prisma.conversation.findUnique({
                            where: {
                                sender_recipient: {
                                    sender: sender,
                                    recipient: recipient,
                                },
                            },
                            select: {
                                id: true,
                            }
                        })

                        if(existingId){
                            // console.log(existingId.id)
                            return existingId.id;
                        }
                        throw new InternalServerErrorException('conversation exists but could not be retrieved.');

                    }catch (error){
                        throw error;
                    }
                }
            }
            throw error;
        }
    }





}
