import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from './messages.entity';
import { createMessageDto } from 'src/validators/messages.validator';

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(Message)
        private readonly messageModel: typeof Message
    ) {}

    // 🔹 Yangi xabar yaratish
    async createMessage(dto: createMessageDto) {
        return this.messageModel.create({ ...dto } as any);
    }

    // 🔹 ID bo‘yicha xabarni olish
    async getMessageById(id: number) {
        return this.messageModel.findByPk(id);
    }

    // 🔹 Barcha xabarlarni olish
    async getAllMessages() {
        return this.messageModel.findAll();
    }

    // 🔹 Foydalanuvchining barcha xabarlarini olish (yuborilgan va qabul qilingan)
    async getMessagesByUser(userId: number) {
        return this.messageModel.findAll({
            where: {
                senderId: userId,
            },
        });
    }

    // 🔹 Qabul qiluvchiga kelgan barcha xabarlarni olish
    async getReceivedMessages(receiverId: number) {
        return this.messageModel.findAll({
            where: {
                receiverId,
            },
        });
    }

    // 🔹 Xabarni o‘chirish
    async deleteMessage(id: number) {
        const message = await this.getMessageById(id);
        if (!message) {
            throw new Error('Message not found');
        }
        await message.destroy();
        return { message: 'Message deleted successfully' };
    }

    async getMessagesByChatId(chatId: number) {
        return this.messageModel.findAll({
            where: { chatId },
            order: [['createdAt', 'ASC']], // Xabarlarni eski vaqtdan yangi vaqtga qarab chiqaramiz
        });
    }
    

    // 🔹 Xabarni "ko‘rildi" sifatida belgilash
    async markAsSeen(id: number) {
        const message = await this.getMessageById(id);
        if (!message) {
            throw new Error('Message not found');
        }
        message.seen = true;
        await message.save();
        return message;
    }
}
