import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/user.entity';
import { Session } from './sessions.entity';
import { SessionsGateway } from './sessionsgetway';


@Module({

  imports: [
    SequelizeModule.forFeature([User, Session ]),
  ],
  providers: [SessionsService, SessionsGateway],
  controllers: [SessionsController],
  exports: [SessionsService],
})
export class SessionsModule {}
