import { Injectable } from "@nestjs/common";
import { User } from "./entities/users.entity";
import * as nodemailer from 'nodemailer'



@Injectable()
export class EmailService {
    private transporter = nodemailer.createTransport({
            host: 'smtp-mail.outlook.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'vikashkumar1319@outlook.com',
                pass: '1a3b1c9d'
            }
        })
    async sendEmail(username: string, email: string, password: string) {
        console.log(username, email, password)
        const mailOptions = {
            from: 'vikashkumar1319@outlook.com',
            to: email,
            subject: 'Your account has been created!',
            text: `
              Hi ${username},
      
              Your account has been created on our platform. Here are your login credentials:
      
              Username: ${username}
              Email: ${email}
              Password: ${password} (Please change this password immediately)
      
              Thanks,
              The Authentify Team
            `,
        };

          const response = await this.transporter.sendMail(mailOptions);
          console.log(response)
    }


}