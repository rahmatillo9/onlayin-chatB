import { 
  Body, 
  Controller, 
  Get, 
  NotFoundException, 
  Post, 
  Query, 
  UseGuards 
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from 'src/users/users.service'; // ✅ UsersService ni import qilish

@Controller('protected')
export class ProtectedController {
  constructor(private readonly usersService: UsersService) {} // ✅ Service ni Inject qilish

  @UseGuards(JwtAuthGuard)
  @Get()
  getProtectedResource() {
    return { message: 'This is a protected route' };
  }

  @Post('send-confirmation-email')
  async sendConfirmationEmail(@Body('email') email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('Bunday email topilmadi');

    return this.usersService.sendEmailConfirmation(user.id, email);
  }

  @Get('confirm-email')
  async confirmEmail(@Query('token') token: string) {
    return this.usersService.confirmEmail(token);
  }
}
