import { Injectable, NestMiddleware } from "@nestjs/common";
import { isArray } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { UsersService } from "src/users/users.service";
import { User as UserEntity } from '../entities/users.entity'
import { verify } from 'jsonwebtoken';
import 'dotenv/config'

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserEntity;
        }
    }
}

interface JwtPayload{
    id: string;
}


@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private usersService: UsersService) { }
    async use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        console.log("authHeader",authHeader)
        if (!authHeader || isArray(authHeader) || !authHeader.startsWith('Bearer ')) {
            req.currentUser = null;
            next();
            return;
        }else{
            try{
                console.log("trying...")
                const token = authHeader.split(' ')[1];
                console.log(token, process.env.ACCESS_TOKEN_SECRET_KEY);
                const {id} = <JwtPayload>verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
                console.log("id", id)
                console.log(this.usersService)
                const [currentUser] = await this.usersService.findOne(parseInt(id))
                req.currentUser = currentUser;
                next();
            }catch(err){
                console.log(err)
                req.currentUser = null;
                next();
            }
        }
    }
}