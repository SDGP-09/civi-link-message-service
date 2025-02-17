import {IsNotEmpty, IsString} from "class-validator";


export class ConversationsInitDto{

    @IsNotEmpty()
    @IsString()
    user: string;

//DELETE the DTO
    //Or try to restrict so that no data can be sent
}