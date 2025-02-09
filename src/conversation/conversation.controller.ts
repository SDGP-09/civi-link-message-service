import {Controller, Post, UseGuards} from '@nestjs/common';
import {GetUser} from "../auth/decorator";
import {UserJwtGuard} from "../auth/guard/userJwt.guard";

@Controller('conversation')
export class ConversationController {

    @UseGuards(UserJwtGuard)
    @Post('create')
    create(@GetUser() user: any){
        console.log(user)
    }
}
