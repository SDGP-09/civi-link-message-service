import {AuthGuard} from "@nestjs/passport";


export class UserJwtGuard extends AuthGuard('conversationJwt'){

    constructor() {
        super();
    }

}