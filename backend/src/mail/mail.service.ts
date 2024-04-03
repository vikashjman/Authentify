import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { MailgunMessageData, MailgunService } from 'nestjs-mailgun';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {

    private transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'vikashkumar1319@outlook.com',
            pass: '1a3b1c9d'
        }
    })
    constructor(
        private mailerService: MailerService,
        private mailGunService: MailgunService
    ) { }

    async nodeMailerSendMail(username: string, email: string, password: string) {
        this
            .mailerService
            .sendMail({
                to: email, // List of receivers email address
                from: process.env.TRANSPORTER_EMAIL, // Senders email address
                subject: 'Testing Nest MailerModule ✔', // Subject line
                text: 'welcome', // plaintext body
                html: '<b>welcome</b>', // HTML body content
            })
            .then((success) => {
                console.log(success)
            })
            .catch((err) => {
                console.log(err)
            });
    }
    async mailGunSendMail(username: string, email: string, password: string) {
        const templateFilePath = path.join(__dirname, 'templates', 'confirmation.hbs');
        const templateContent = fs.readFileSync(templateFilePath, 'utf8');

        // Compile the Handlebars template
        const compiledTemplate = Handlebars.compile(templateContent);

        // Data to be passed to the template
        const data = {
            username: username,
            email: email,
            password: password
        };


        const mailgunMessageData: MailgunMessageData = {
            from: 'your@example.com', // From email address
            to: email, // Recipient's email address
            subject: 'Welcome to Authentify', // Email subject
            text: '', // Text version of the email
            html: compiledTemplate(data), // HTML version of the email
            attachment: '', // Attachments if any
            cc: '', // Carbon copy recipients if any
            bcc: '', // Blind carbon copy recipients if any
            'o:testmode': 'no', // Test mode setting
            'h:X-Mailgun-Variables': JSON.stringify({ key: 'value' }), // Custom variables
        };

        // Send email using the Mailgun service
        const response = await this.mailGunService.createEmail(process.env.MAILGUN_DOMAIN, mailgunMessageData);
        console.log("mailgun", response);
    }








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
