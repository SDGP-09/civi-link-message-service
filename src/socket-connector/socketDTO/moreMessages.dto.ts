import {IsInt, IsNotEmpty} from "class-validator";
import {Type} from "class-transformer";


export class MoreMessagesDto {

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    last: number;
}