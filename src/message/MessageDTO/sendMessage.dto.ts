import {IsInt, IsNotEmpty, IsOptional} from "class-validator";
import {Type} from "class-transformer";


export class SendMessageDto{

    @IsNotEmpty()
    message: string;


    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    conversationId: number;


    @IsOptional()
    @Type(() => Number)
    @IsInt()
    reference?: number;
}