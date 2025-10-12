import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { ListItem } from '../lists/entities/list-item.entity';
import { List } from '../lists/entities/list.entity';
import { ListCollaborator } from '../lists/entities/list-collaborator.entity';
import { ListService } from '../lists/list.service';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ListItem, List, ListCollaborator, User])],
  providers: [ItemsService, ListService],
  controllers: [ItemsController],
})
export class ItemsModule {}
