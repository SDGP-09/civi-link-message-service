import {Attachment} from "@prisma/client";

export interface MessageStructure {
    data: {
        message: string,
        conversationId: number,
        reference?: number,
        correspondingId?: number,
    },
    select: {
        id: boolean,
    },
}
