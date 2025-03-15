import { Controller, Get, Query } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('send')
  async sendTestEmail(@Query('to') to: string) {
    try {
      await this.mailService.sendEmail(to, 'Test Email', 'Bu test email xabari.');
      return { message: '✅ Email yuborildi!' };
    } catch (error) {
      return { error: '❌ Email yuborishda xatolik!', details: error };
    }
  }
}
