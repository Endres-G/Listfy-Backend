import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollabService } from './collab.service';
import { CollabController } from './collab.controller';
import { ListCollaborator } from './entities/list-collaborator.entity';
import { List } from '../lists/entities/list.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([List, User, ListCollaborator])],
  providers: [CollabService],
  controllers: [CollabController],
  exports: [CollabService],
})
export class CollabModule {}
