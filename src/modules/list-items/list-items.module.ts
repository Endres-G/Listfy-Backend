import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListItemsService } from './list-items.service';
import { ListItem } from './entities/list-item.entity';
import { List } from '../lists/entities/list.entity';
import { User } from '../users/entities/user.entity';
import { ListItemsController } from './list-items.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ListItem, List, User])],
  providers: [ListItemsService],
  controllers: [ListItemsController],
})
export class ListItemsModule {}
