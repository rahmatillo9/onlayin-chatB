import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Session } from './sessions.entity';
import { createSessionDto } from 'src/validators/session.validator';
import { Cron } from '@nestjs/schedule';
import { Op } from 'sequelize';

@Injectable()
export class SessionsService {
    constructor(
        @InjectModel(Session)
        private readonly sessionModel: typeof Session
    ) {}

    // 🔹 Yangi sessiya yaratish
    async createSession(dto: createSessionDto) {
        return this.sessionModel.create({
            ...dto,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 soatdan keyin o‘chiriladi
        } as Session);
    }

    // 🔹 Muddati tugagan sessiyalarni o‘chirish
    async deleteExpiredSessions() {
        await this.sessionModel.destroy({
            where: { expiresAt: { [Op.lt]: new Date() } },
        });
    }

    // 🔹 Har 5 daqiqada muddati tugagan sessiyalarni o‘chirish
    @Cron('*/5 * * * *')
    async cleanExpiredSessions() {
        await this.deleteExpiredSessions();
        console.log("✅ Eski sessiyalar o‘chirildi");
    }

    // 🔹 Foydalanuvchining barcha sessiyalarini olish
    async getSessionsByUser(userId: number) {
        return this.sessionModel.findAll({ where: { userId } });
    }

    // 🔹 ID orqali sessiyani olish
    async getSessionById(id: number) {
        const session = await this.sessionModel.findByPk(id);
        if (!session) throw new NotFoundException('Session not found');
        return session;
    }

    // 🔹 Sessiyani o‘chirish (logout qilish)
    async deleteSession(id: number) {
        const session = await this.getSessionById(id);
        await session.destroy();
        return { message: 'Session deleted successfully' };
    }

    // 🔹 Foydalanuvchining barcha sessiyalarini o‘chirish (butunlay logout qilish)
    async deleteAllSessionsByUser(userId: number) {
        await this.sessionModel.destroy({ where: { userId } });
        return { message: 'All sessions deleted for user' };
    }
}
