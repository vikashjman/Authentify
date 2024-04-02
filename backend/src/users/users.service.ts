import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/users.entity";
import { Repository } from "typeorm";
import { scrypt as _scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { sign } from "jsonwebtoken"

import 'dotenv/config'
import { MailService } from "src/mail/mail.service";


const scrypt = promisify(_scrypt);

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        private emailService: MailService
    ) { }

    create(username: string, email: string, password: string) {
        const user = this.userRepo.create({ username, email, password });
        return this.userRepo.save(user)
    }

    async signin(email: string, password: string) {
        const [user] = await this.find(email);
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

    generateRandomPassword() {
        const length = 10; // Set the desired length of the random password
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
        let randomPassword = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            randomPassword += charset[randomIndex];
        }
        return randomPassword;
    }
    async signup(username: string, email: string) {
        console.log("signup ", username, email)
        const password = this.generateRandomPassword();
        // see if email is in use
        console.log("Going founding")
        const users = await this.find(email);
        if (users.length) {
            throw new BadRequestException('email in use');
        }
        console.log("After not founding")
        // Hash the users password
        // Generate a salt
        const salt = randomBytes(8).toString('hex');

        // Hash the salt and the password together
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        // Join the hashed result and the salt together
        const result = salt + '.' + hash.toString('hex');

        // Create a new user and save it
        console.log("before create", username, email, password);

        const user = await this.create(username, email, result);

        console.log("after create", username, email, password);
        // const user = this.userRepo.create({ username, email, password:result });
        // return await this.userRepo.save(user)
        await this.emailService.mailGunSendMail(username, email, password);

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
        const user = await this.userRepo.find({ where: { id } });
        return user;
    }


    async verifyPassword(id: number, password: string): Promise<boolean> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const [salt, storedHash] = user.password.split('.');

        const hash = (await scrypt(password, salt, 32)) as Buffer;
        return storedHash === hash.toString('hex');
    }

    async updatePassword(id: number, newPassword: string) {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Hash the new password and update it in the database
        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(newPassword, salt, 32)) as Buffer;
        user.password = salt + '.' + hash.toString('hex');
        user.resetflag = false;
        await this.userRepo.save(user);
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