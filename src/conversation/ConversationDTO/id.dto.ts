import {IsInt, IsNotEmpty} from "class-validator";
import {Type} from "class-transformer";


export class IdDto{

    @IsNotEmpty()
    @Type(() => Number) //Zero args and should return a type
    @IsInt()
    id: number;

}