import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from "dotenv";

dotenv.config();
@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Yoki SMTP serveringiz
      auth: {
        user: process.env.SENDER_EMAIL, // Gmail manzilingiz
        pass: process.env.NODE_GMAIL_PASSWORD, // Gmail parolingiz yoki App Password
      },
      debug: true, // ✅ Debug rejimi yoqiladi
      logger: true, // 📜 Loglarni ko‘rsatis
    });
  }

  async sendEmail(to: string, subject: string, text: string) {
    try {
      const info = await this.transporter.sendMail({
        from: '"Time Chat" <your-email@gmail.com>',
        to,
        subject,
        text,
      });
  
      console.log(`✅ Email yuborildi: ${info.messageId}`);
      console.log(`📩 SMTP Response:`, info.response);
    } catch (error) {
      console.error(`❌ Email jo‘natishda xatolik:`, error);
    }
  }
  
  
}
