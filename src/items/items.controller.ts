import { Controller, Get, Post, Patch, Delete, Param, Body, Req } from '@nestjs/common';
import { ItemsService } from './items.service';

@Controller('lists/:listId/items')
export class ItemsController {
  constructor(private readonly items: ItemsService) {}

  @Get()
  list(@Param('listId') listId: string, @Req() req) {
    return this.items.list(listId, req.user.sub);
  }

  @Post()
  create(@Param('listId') listId: string, @Body() dto: { name: string; quantity?: number; notes?: string }, @Req() req) {
    return this.items.create(listId, dto, req.user.sub);
  }

  @Patch(':itemId')
  update(
    @Param('listId') listId: string,
    @Param('itemId') itemId: string,
    @Body() dto: { name?: string; quantity?: number; notes?: string; checked?: boolean },
    @Req() req,
  ) {
    return this.items.update(listId, itemId, dto, req.user.sub);
  }

  @Delete(':itemId')
  remove(@Param('listId') listId: string, @Param('itemId') itemId: string, @Req() req) {
    return this.items.remove(listId, itemId, req.user.sub);
  }
}
