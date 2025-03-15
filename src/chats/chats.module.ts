import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/user.entity';
import { Chat } from './chats.entity';
import { Message } from 'src/messages/messages.entity';
import { MessagesService } from 'src/messages/messages.service';

@Module({

  imports: [
    SequelizeModule.forFeature([User, Chat, Message ]),
  ],
  providers: [ChatsService, MessagesService],
  controllers: [ChatsController],
  exports: [ChatsService],
})
export class ChatsModule {}
