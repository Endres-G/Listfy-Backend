import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { ListService } from './list.service';

@ApiTags('Lists')
@Controller('lists')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  async create(@Body() dto: CreateListDto, @GetUser() user: User) {
    return this.listService.create(dto, user);
  }

  @Get()
  async findAll(@GetUser() user: User) {
    return this.listService.findAll(user);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateListDto,
    @GetUser() user: User,
  ) {
    return this.listService.update(id, dto, user);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.listService.remove(id, user);
  }

  @Get(':listId/items')
  async listItems(
    @Param('listId', ParseIntPipe) listId: number,
    @Query('include') include: string,
    @GetUser() user: User, // disponível se quiser validar permissão aqui futuramente
  ) {
    const withAssignee = (include || '').split(',').includes('assignee');
    return this.listService.listItems(listId, { withAssignee });
  }
 
  @Patch(':listId/items/:itemId/assignee')
  async updateItemAssignee(
    @Param('listId', ParseIntPipe) listId: number,
    @Param('itemId') itemId: string,
    @Body() body: { userId?: string | null },
    @GetUser() user: User, // disponível se quiser validar permissão aqui futuramente
  ) {
    const newAssigneeId = body?.userId ?? null;
    return this.listService.updateItemAssignee(listId, itemId, newAssigneeId);
  }
}
