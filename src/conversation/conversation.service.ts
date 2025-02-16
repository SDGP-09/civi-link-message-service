import {ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, Post} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";

import {PrismaClientKnownRequestError} from '@prisma/client/runtime/library';
import {ConversationInterface} from "./interfaces";
import {MessageService} from "../message/message.service";

@Injectable()
export class ConversationService {

    constructor(
        private prisma: PrismaService,

    ){}

    async addConversation(sender: string, recipient: string){
        try{
            // console.log("Service reached");
            const conversationId = await this.prisma.conversation.create({
                data:{
                    sender,
                    recipient,
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
                                    sender,
                                    recipient,
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



    async removeConversation(user:string, id: number){



        try{
            const conversation = await this.prisma.conversation.findUniqueOrThrow({
                where: {
                    id,
                },
                select: {
                    sender:true,
                }

            })



            if(user !== conversation.sender){
                throw new ForbiddenException('Unauthorised !');
            }


            await this.prisma.conversation.delete({
                where:  {
                    id,
                },
            })


        }catch(error){
            if (error instanceof PrismaClientKnownRequestError){
                if (error.code === 'P2025'){
                    throw new NotFoundException("Conversation not found");
                }
            }

            throw error;
        }

    }



    async retrieveAllConversations(user:string, last?: number, flag: boolean = false){


        // type ConversationMessages = {
        //     id: number,
        //     sender: string,
        //     updatedAt: Date | null,
        //     unreadMessageCount?: number | null,
        // };


        let filter:any = {
            sender: user,
        }

        if(last != undefined && !flag){
            filter.id = {lt: last}
        }

        if(last !== undefined  && flag){
            filter.id = {gte: last}
        }




        let query:any = {
            where: filter,
            orderBy: {
                updatedAt: 'desc',
            },
            select: {
                id: true,
                sender: true,
                updatedAt: true
            },

        }


        if(!flag){
            query.take= 50;

        }


        try{

            const conversations: ConversationInterface[] | null = await this.prisma.conversation.findMany(query);

            if (conversations){

                for (const conversation of conversations){
                    conversation.unreadMessageCount = await this.prisma.message.count({
                        where: {
                            conversationId: conversation.id,
                            viewed: false,
                        },
                    });



                }

            }

            return conversations;


        }catch (error){
            throw error;
        }
    }




    async loadConversation(conversationId: number, last?: number){

        const where: any = {conversationId};

        if (last){
            where.id = {lt: last}
        }

        const query = {
            where,
            orderBy: {
                time: 'asc' as 'asc',
            },
            take: 50,
        }





        try{
            return this.prisma.message.findMany(query);
            
        }catch (error){
            throw error;
        }
    }


}
