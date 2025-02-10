import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {Attachment} from "@prisma/client";


@Injectable()
export class AttachmentService {

    constructor(private prisma: PrismaService){}


    async attachAll(messageId: number, attachments: string[]){

        for (const link of attachments) {

            try{
                await this.prisma.attachment.create({
                    data: {
                        messageId,
                        source: link,
                    }
                })
            } catch(error){
                throw error;
            }
        }
    }

    async retrieveAll(messageId: number){

        try {
            return await this.prisma.attachment.findMany({
                where: {
                    messageId,
                },
                select: {
                    source: true,
                }
            });



        }catch (error){
            throw error;
        }


    }




}
