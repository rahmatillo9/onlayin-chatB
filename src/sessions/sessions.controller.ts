import { Controller, Post, Get, Delete, Param, Body, Req } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { createSessionDto } from 'src/validators/session.validator';

@Controller('sessions')
export class SessionsController {
    constructor(private readonly sessionsService: SessionsService) {}

    // 🔹 Yangi sessiya yaratish
    @Post()
    async createSession(@Body() dto: createSessionDto) {
        return this.sessionsService.createSession(dto);
    }

    // 🔹 Foydalanuvchining barcha sessiyalarini olish
    @Get('user/:userId')
    async getSessionsByUser(@Param('userId') userId: number) {
        return this.sessionsService.getSessionsByUser(userId);
    }

    // 🔹 ID orqali sessiyani olish
    @Get(':id')
    async getSessionById(@Param('id') id: number) {
        return this.sessionsService.getSessionById(id);
    }

    // 🔹 Sessiyani o‘chirish (logout qilish)
    @Delete(':id')
    async deleteSession(@Param('id') id: number) {
        return this.sessionsService.deleteSession(id);
    }

    // 🔹 Foydalanuvchini butunlay logout qilish (barcha sessiyalarni o‘chirish)
    @Delete('user/:userId')
    async deleteAllSessionsByUser(@Param('userId') userId: number) {
        return this.sessionsService.deleteAllSessionsByUser(userId);
    }

    @Delete('/logout')
    async logout(@Req() req) {
        const token = req.headers.authorization.split(' ')[1]; // Token olish
        await this.sessionsService.deleteSession(token);
        return { message: "Logout muvaffaqiyatli amalga oshirildi" };
    }
}
