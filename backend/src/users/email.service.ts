import {  Injectable } from "@nestjs/common";
import { User } from "./entities/users.entity";
import * as nodemailer from 'nodemailer'



@Injectable()
export class EmailService {
    private transporter = nodemailer.createTransport({

    })
    async sendEmail(username:string, email:string, password:string){
        const mailOptions = {
            from: 'your-email@example.com',
            to: email,
            subject: 'Your account has been created!',
            text: `
              Hi ${username},
      
              Your account has been created on our platform. Here are your login credentials:
      
              Username: ${username}
              Email: ${email}
              Password: ${password} (Please change this password immediately)
      
              Thanks,
              The Admin Team
            `,
          };
      
          await this.transporter.sendMail(mailOptions);
    }

   
}