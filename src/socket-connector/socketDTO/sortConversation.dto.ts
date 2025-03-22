import {IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";


export class SortConversationDto {



    @IsOptional()
    @Type(() => Number) //Zero args and should return a type
    @IsInt()
    last : number;

    @IsOptional()
    @IsBoolean()
    flag?: boolean;
}