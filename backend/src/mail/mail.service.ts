import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { MailgunMessageData, MailgunService } from 'nestjs-mailgun';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

@Injectable()
export class MailService {
    constructor(
        private mailerService: MailerService,
        private mailGunService: MailgunService
    ) { }

    async nodeMailerSendMail(username: string, email: string, password: string) {
        await this.mailerService.sendMail({
            to: process.env.TRANSPORTER_MAIL,
            subject: 'Your account has been created!',
            template: './confirmation',
            context: {
                username,
                password,
                email
            },
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
        await this.mailGunService.createEmail(process.env.MAILGUN_DOMAIN, mailgunMessageData);
    }
}
