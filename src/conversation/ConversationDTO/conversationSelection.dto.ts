import {IsInt, IsNotEmpty, IsOptional} from "class-validator";
import {Type} from "class-transformer";


export class ConversationSelectionDto{


    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    conversationId: number;


}