import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { ListItem } from './entities/list-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([List, ListItem])],
  providers: [ListService],
  controllers: [ListController],
  exports: [],
})
export class ListModule {}
