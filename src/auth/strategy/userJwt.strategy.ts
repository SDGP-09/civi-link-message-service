import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-http-bearer";
import {Injectable, UnauthorizedException} from "@nestjs/common";
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'conversationJwt'){

    constructor(){
        super();
        // console.log("Reached here");
    }

    async validate(token: string){

        // console.log('STRATEGY: token =', token);

        //Validating API call here';
        const validated: boolean = true;

        // console.log("Reached here");


        if (validated){
            const payload = jwt.decode(token);

            // console.log('STRATEGY: payload =', payload);
            // console.log("token");
            if (payload) {
                    return {userid: payload.sub}

            }

        }else{
            throw new UnauthorizedException("User not authorised");
        }
    }

}