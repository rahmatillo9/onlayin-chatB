import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Chat } from './chats.entity';

import { createChatDto } from 'src/validators/chats.validator';
import { Op } from 'sequelize';
@Injectable()
export class ChatsService {
    constructor(
        @InjectModel(Chat)
        private readonly chatModel: typeof Chat
    ){}

    async creatChat(dto: createChatDto){
        return this.chatModel.create({...dto} as Chat);
    }

    async getChatById(id: number){
        return this.chatModel.findByPk(id, {
            include: ['user1', 'user2']
        });
    }

    async getChatsByUserId(userId: number){
        return this.chatModel.findAll({
            include: ['user1', 'user2'],
            where: {
                [Op.or]: [{user1Id: userId}, {user2Id: userId}]
            }
        });
    }

    async deleteChat(id: number){
        return this.chatModel.destroy({
            where: {
                id
            }
        });
    }
}
