import { IsEmail, IsString, IsOptional } from 'class-validator';

export class ResetPasswordDto {
    // @IsEmail()
    // email: string;
    @IsString()
    oldPassword: string;
    @IsString()
    newPassword: string;
}