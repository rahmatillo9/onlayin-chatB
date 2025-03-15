import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from './user.entity';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { CreateUsersDto, UpdateUserDto } from 'src/validators/users.validator';
import { Op } from 'sequelize';
import * as dotenv from "dotenv";

dotenv.config();
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly mailService: MailService
  ) {}

  async create(createUserDto: CreateUsersDto) {
    // Parolni hash qilish
    const hashPassword = await bcrypt.hash(createUserDto.password, 10);
  
    // Yangi foydalanuvchi yaratish
    return this.userModel.create({
      ...createUserDto,
      password: hashPassword, // Hashlangan parolni saqlash
    } as User);
  }

  async generateEmailConfirmationToken(userId: number): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex'); // 32 baytli tasodifiy token
    await this.userModel.update({ emailConfirmationToken: token }, { where: { id: userId } });

    return token;
  }

  async sendEmailConfirmation(userId: number, email: string) {
    const token = await this.generateEmailConfirmationToken(userId);
    const confirmationLink = `${process.env.LINK}/auth/confirm-email?token=${token}`;
  
    await this.mailService.sendEmail(
      email,
      'Emailingizni tasdiqlang',
      `Emailingizni tasdiqlash uchun quyidagi havolani bosing: ${confirmationLink}`
    );
  
    return { message: 'Tasdiqlash emaili yuborildi!' };
  }

  async confirmEmail(token: string) {
    const user = await this.userModel.findOne({ where: { emailConfirmationToken: token } });
  
    if (!user) {
      throw new BadRequestException('Noto‘g‘ri yoki muddati o‘tgan token');
    }
  
    user.isEmailConfirmed = true;
    user.emailConfirmationToken = undefined; // Token ishlatilganidan keyin uni o‘chiramiz
    await user.save();
  
    return { message: 'Emailingiz muvaffaqiyatli tasdiqlandi!' };
  }
  

  async validatePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword); 
  }

  async findBynickname(username: string) {
    return this.userModel.findOne({ where: { username } });
  }


  async findAll(): Promise<User[]> {
    return this.userModel.findAll({
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: number) {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserProfileDto: UpdateUserDto): Promise<User> {
    const userProfile = await this.userModel.findByPk(id);
    if (!userProfile) {
      throw new NotFoundException(`User Profile ID: ${id} not found`);
    }
    return userProfile.update(updateUserProfileDto);
  }

  async findByUsernameOrEmail(identifier: string) {
    const user = await this.userModel.findOne({
      where: {
        [Op.or]: [{ username: identifier }, { email: identifier }],
      },
      attributes: { exclude: ['password'] }, // ✅ Faqat parolni yashirish
    });
  
    console.log('User:', user); // Tekshirish uchun log
    return user;
  }
  
  
  

  async deleteUser(id: number): Promise<void> {
    const user = await this.userModel.findOne({ where: { id } });
    if (user) {
      await user.destroy();
    }
  }

  // 📌 1. Email orqali foydalanuvchini topish
  async findByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }

  // 📌 2. Email yoki username orqali foydalanuvchini topish
  async findByEmailOrNickname(email: string, username: string) {
    return this.userModel.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });
  }

  async sendPasswordResetEmail(email: string) {
    const user = await this.userModel.findOne({ where: { email } });
  
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }
  
    // 6 xonali random kod yaratamiz
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  
    // Reset kodni bazaga saqlaymiz
    user.resetCode = resetCode;
    await user.save();
  
    // Foydalanuvchiga email jo‘natamiz
    await this.mailService.sendEmail(
      email,
      'Parolni tiklash',
      `Parolingizni tiklash uchun ushbu kodni kiriting: ${resetCode}`
    );
  
    return { message: 'Parolni tiklash kodi emailingizga yuborildi!' };
  }
  
  async resetPassword(resetCode: string, newPassword: string) {
    const user = await this.userModel.findOne({ where: { resetCode } });
  
    if (!user) {
      throw new BadRequestException('Noto‘g‘ri yoki eskirgan tiklash kodi');
    }
  
    // Yangi parolni hash qilamiz
    const hashedPassword = await bcrypt.hash(newPassword, 10);
  
    // Parolni yangilaymiz
    user.password = hashedPassword;
    user.resetCode = undefined; // Kodni o‘chirib yuboramiz
    await user.save();
  
    return { message: 'Parolingiz muvaffaqiyatli o‘zgartirildi!' };
  }
  
  
}
