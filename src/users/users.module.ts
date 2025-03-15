import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.entity';
import { UsersController } from './user.controller';
import { MailService } from 'src/mail/mail.service';
import { Message } from 'src/messages/messages.entity';
import { Chat } from 'src/chats/chats.entity';
import { Session } from 'src/sessions/sessions.entity';



@Module({
  imports: [
    SequelizeModule.forFeature([User, Message, Chat, Session ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, MailService],
  exports: [UsersService],
})
export class UsersModule {}

