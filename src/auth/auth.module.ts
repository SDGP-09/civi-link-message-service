import { Module } from '@nestjs/common';
import {JwtModule} from "@nestjs/jwt";
import {UserJwtStrategy} from "./strategy";

@Module({
    imports: [JwtModule.register({})],
    providers: [UserJwtStrategy]
})
export class AuthModule {}
