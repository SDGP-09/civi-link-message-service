import {IsNotEmpty} from "class-validator";

export class UserDto {

    @IsNotEmpty()
    recipient: string;

}