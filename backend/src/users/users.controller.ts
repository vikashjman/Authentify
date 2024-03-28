import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { UdpateUserDto } from './dtos/update-user.dto';
import { AuthenticationGuard } from 'src/utils/guards/authentication.gaurd';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import { User } from './entities/users.entity';
import { AuthorizeGuard } from 'src/utils/guards/authorization.gaurd';
import { Roles } from 'src/utils/common/user-roles.enum';
import { ResetPasswordDto } from './dtos/password-reset.dto';

@Controller('users')
export class UsersController {

    constructor(
        private usersService: UsersService
    ){}


    // only should be accessed by admin
    // also send emails
    @UseGuards(AuthenticationGuard)
    @UseGuards(AuthorizeGuard([Roles.ADMIN]))
    @Post()
    async createUser(@Body() body: CreateUserDto){
        const user = await this.usersService.signup(body.username, body.email);
        return user;
    }


    // user will login using whaemail and password
    @Post('login')
    async loginUser(@Body() body: LoginUserDto){
        const user = await this.usersService.signin(body.email, body.password);
        const accessToken = await this.usersService.accessToken(user);
        return {accessToken, user};
    }


    @UseGuards(AuthenticationGuard)
    // have authentication 
    @Put('/:id')
    async updateUser(@Param('id') id:string, @Body() body: UdpateUserDto){
        return this.usersService.update(parseInt(id), body);
    }

    @UseGuards(AuthenticationGuard)
    @UseGuards(AuthorizeGuard([Roles.ADMIN]))
    // only admin access
    @Delete('/:id')
    async deleteUser(@Param('id') id:string){
        return this.usersService.remove(parseInt(id));
    }


    @UseGuards(AuthenticationGuard)
    // user access
    @Get('profile')
    async userProfile(@CurrentUser() currentUser: User){
        return currentUser;
    }

    @UseGuards(AuthenticationGuard)
    @UseGuards(AuthorizeGuard([Roles.ADMIN]))
    @Get("/")
    async getAllUser(){
        return this.usersService.findall();
    }

    @Put("/reset-password/:id")
    async resetPassword(@Param('id') id: string, @Body() body: ResetPasswordDto) {
        const { oldPassword, newPassword } = body;

        // Verify old password before proceeding
        const isOldPasswordValid = await this.usersService.verifyPassword(parseInt(id), oldPassword);
        if (!isOldPasswordValid) {
            throw new Error('Invalid old password');
        }

        // Update the user's password in the database
        await this.usersService.updatePassword(parseInt(id), newPassword);

        return { message: 'Password reset successful!' };
    }


    // @Post('group')
    // async createUserGroup(@Body() body: CreateUserGroupDto){
    //     const userGroup = await this.usersService.createUserGroup(body.groupId, body.userId);
    //     return userGroup;
    // }

    // @Get('/groups/:userId')
    // async getGroupForUser(@Param('userId') userId:string){
    //     const groups = await this.usersService.userBelongToGroups(parseInt(userId));
    //     return groups;
    // }   

    // @Get('/actions/:userId')
    // async getActionsForUser(@Param('userId') userId:string){
    //     const actions = await this.usersService.getUserActions(parseInt(userId));
    //     return actions;
    // }
}
