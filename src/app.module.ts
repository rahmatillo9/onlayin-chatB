import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './authguard/JwtModule ';
import { MessagesModule } from './messages/messages.module';
import { ChatsModule } from './chats/chats.module';
import { SessionsModule } from './sessions/sessions.module';

import * as dotenv from "dotenv";

dotenv.config();
@Module({
  imports: [
    UsersModule,
    AuthModule,
   SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadModels: true,
      synchronize: true,

      // pool: {
      //   max: 10, // Eng ko‘p 10 ta ulanish
      //   min: 2,  // Eng kamida 2 ta ulanish
      //   acquire: 30000, // 30s ichida ulana olmasa, timeout
      //   idle: 10000, // 10s harakatsiz bo‘lsa, ulanish yopiladi
      // },
    }),
   MessagesModule,
   ChatsModule,
   SessionsModule,



  ],

})
export class AppModule {}


  