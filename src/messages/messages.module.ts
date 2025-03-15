import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/user.entity';
import { Message } from './messages.entity';
import { Chat } from 'src/chats/chats.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Message, Chat ]),
  ],
  providers: [MessagesService],
  controllers: [MessagesController],
  exports: [MessagesService],
})
export class MessagesModule {}
