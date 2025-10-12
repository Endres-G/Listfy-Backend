import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListItem } from '../lists/entities/list-item.entity';
import { ListService } from '../lists/list.service';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(ListItem) private readonly itemRepo: Repository<ListItem>,
    private readonly listsService: ListService,
  ) {}

  async list(listId: string, userId: string) {
    await this.listsService.assertCanView(listId, userId);
    return this.itemRepo.find({ where: { list: { id: listId } as any } });
  }

  async create(listId: string, dto: { name: string; quantity?: number; notes?: string }, userId: string) {
    await this.listsService.assertCanEdit(listId, userId);
    const item = this.itemRepo.create({ ...dto, list: { id: listId } as any, checked: false });
    return this.itemRepo.save(item);
  }

  async update(listId: string, itemId: string, dto: Partial<ListItem>, userId: string) {
    await this.listsService.assertCanEdit(listId, userId);
    await this.itemRepo.update({ id: itemId, list: { id: listId } as any }, dto);
    return this.itemRepo.findOne({ where: { id: itemId } });
  }

  async remove(listId: string, itemId: string, userId: string) {
    await this.listsService.assertCanEdit(listId, userId);
    await this.itemRepo.delete({ id: itemId, list: { id: listId } as any });
    return { deleted: true };
  }
}
