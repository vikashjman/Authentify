import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/users.entity";
import { Repository } from "typeorm";
import { scrypt as _scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { sign } from "jsonwebtoken"

import 'dotenv/config'

const scrypt = promisify(_scrypt);

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) { }

    create(username: string, email: string, password: string) {
        const user = this.userRepo.create({ username, email, password });
        return this.userRepo.save(user)
    }

    async signin(email: string, password: string) {
        const [user] = await this.find(email);
        console.log(user)
        if (!user) {
            throw new NotFoundException('user not found!');
        }

        const [salt, storedHash] = user.password.split('.');

        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('bad password!');
        }

        return user;
    }

    async signup(username: string, email: string, password: string) {
        // see if email is in use
        const users = await this.find(email);
        if (users.length) {
            throw new BadRequestException('email in use');
        }
        // Hash the users password
        // Generate a salt
        const salt = randomBytes(8).toString('hex');

        // Hash the salt and the password together
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        // Join the hashed result and the salt together
        const result = salt + '.' + hash.toString('hex');

        // Create a new user and save it
        const user = await this.create(username, email, result);

        delete user.password;

        // return the user
        return user;
    }

    async find(email: string) {
        return this.userRepo.find({ where: { email } });
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) {
            throw new NotFoundException('user not found!');
        }
        Object.assign(user, attrs);
        return this.userRepo.save(user);
    }

    async remove(id: number) {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) {
            throw new NotFoundException('user not found!');
        }
        return this.userRepo.remove(user);
    }

    async accessToken(user: User): Promise<string> {
        return sign(
            { id: user.id },
            process.env.ACCESS_TOKEN_SECRET_KEY,
            // { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME },
        );
    }

    async findall() {
        return this.userRepo.find();
    }

    async findOne(id: number) {
        console.log("from service",id)
        const user = await  this.userRepo.find({ where: { id } });
        console.log("from service user",user);
        return user;
    }



    // createUserGroup(groupId: number, userId: number) {
    //     const userGroup = this.userGroupRepo.create({ userId, groupId });
    //     return this.userGroupRepo.save(userGroup);
    // }

    // async userBelongToGroups(userId: number) {
    //     const user = await this.userRepo.findOne({ where: { userId }, relations: ['userGroups', 'userGroups.group'] });
    //     return user ? user.userGroups.map(userGroup => userGroup.group) : null;
    // }

    // async getUserActions(userId: number) {
    //     const user = await this.userRepo.findOne({ where: { userId }, relations: ['userGroups', 'userGroups.group', 'userGroups.group.groupActions', 'userGroups.group.groupActions.action'] });
    //     if (!user) return null;

    //     // Flatten the actions from all groups into a single array
    //     const actions = user.userGroups.reduce((acc, userGroup) => [...acc, ...userGroup.group.groupActions.map(groupAction => groupAction.action)], []);
    //     // return actions;
    //     const actionMap = {};
    //     actions.forEach(action => {
    //         actionMap[action.actionId] = action;
    //     });

    //     const uniqueActions = Object.values(actionMap);
    //     return uniqueActions;
    // }

    // async findOne(id: number) {
    //     const user = this.userRepo.findOne({ where: { userId: id } });
    //     return user;
    // }
}