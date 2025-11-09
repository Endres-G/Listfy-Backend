import {
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { ListItemsService } from './list-items.service';
import { CreateListItemDto } from './dto/create-list-item.dto';
import { AssignListItemDto } from './dto/assign-list-item.dto';

@ApiTags('List Items')
@Controller('lists/:listId/items')
export class ListItemsController {
  constructor(private readonly listItemsService: ListItemsService) {}

  @Post()
  create(
    @Param('listId') listId: number,
    @Body() dto: CreateListItemDto,
    @GetUser() user: User,
  ) {
    return this.listItemsService.create(listId, dto, user);
  }

  @Post(':itemId/assign')
  assign(
    @Param('listId') listId: number,
    @Param('itemId') itemId: number,
    @Body() dto: AssignListItemDto,
    @GetUser() user: User,
  ) {
    return this.listItemsService.assign(listId, itemId, dto, user);
  }
}
