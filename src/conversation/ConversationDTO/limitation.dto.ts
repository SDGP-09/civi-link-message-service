import {IsInt, IsOptional} from "class-validator";
import {Type} from "class-transformer";


export class LimitationDto{

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    lastConversationId?: number;
}