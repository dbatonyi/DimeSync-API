import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';

@Injectable()
export class MailerService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendVerificationEmail(userName: string, to: string, verificationToken: string): Promise<void> {
    const template = fs.readFileSync('./mail-templates/verification-email.hbs', 'utf-8');

    const compiledTemplate = handlebars.compile(template);

    const emailHtml = compiledTemplate({
      username: userName,
      verificationLink: `${process.env.FRONTEND_URL}/verify/${verificationToken}`,
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Account Verification',
      html: emailHtml,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
