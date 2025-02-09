import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-http-bearer";
import {UnauthorizedException} from "@nestjs/common";
import * as jwt from 'jsonwebtoken';


export class UserJwtStrategy extends PassportStrategy(Strategy, 'conversationJwt'){

    constructor(){
        super();
        // console.log("Reached here");
    }

    async validate(token: string){
        const validated: string = 'Validating API call here';
        // console.log("Reached here");
        if (validated){
            const payload = jwt.decode(token);

            // console.log("token");
            if (payload) {
                    return {userid: payload.sub}

            }

        }else{
            throw new UnauthorizedException("User not authorised");
        }
    }

}