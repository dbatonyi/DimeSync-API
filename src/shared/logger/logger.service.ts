import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as nodemailer from 'nodemailer';
import { SMTPTransport } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class LoggerService {
  private readonly logger = new Logger();

  private logDirectory = '../../logs';

  constructor() {
    this.ensureLogDirectoryExists();
  }

  private ensureLogDirectoryExists() {
    if (!fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory);
    }
  }

  private logToFile(type: string, message: string) {
    const currentDate = new Date();
    const logFileName = `${type}_${currentDate.toISOString().split('T')[0]}.log`;
    const logFilePath = path.join(this.logDirectory, logFileName);

    const logEntry = `[${currentDate.toISOString()}] [${type.toUpperCase()}] ${message}\n`;

    fs.appendFile(logFilePath, logEntry, (err) => {
      if (err) {
        this.logger.error(`Error writing to log file: ${err.message}`);
      }
    });
  }

  info(message: string) {
    this.logger.log(`INFO: ${message}`);
    this.logToFile('info', message);
  }

  warn(message: string) {
    this.logger.warn(`WARNING: ${message}`);
    this.logToFile('warning', message);
  }

  error(message: string) {
    this.logger.error(`ERROR: ${message}`);
    this.logToFile('error', message);
    this.sendErrorEmail(message);
  }

  private sendErrorEmail(errorMessage: string) {
    const transporter = nodemailer.createTransport({
      service: 'google',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    } as SMTPTransport.Options);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Error Notification',
      text: errorMessage,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        this.logger.error(`Error sending email notification: ${error.message}`);
      } else {
        this.logger.log(`Email notification sent: ${info.response}`);
      }
    });
  }
}
