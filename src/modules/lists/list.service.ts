import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { List } from './entities/list.entity';
import { UpdateListDto } from './dto/update-list.dto';
import { CreateListDto } from './dto/create-list.dto';

import { ListItem } from './entities/list-item.entity';
import { ItemResponseDto } from './dto/item-response.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,

    @InjectRepository(ListItem)
    private readonly itemRepo: Repository<ListItem>,
  ) {}

  async create(dto: CreateListDto, user: User) {
    const list = this.listRepository.create({
      ...dto,
      owner: user,
    });
    return this.listRepository.save(list);
  }

  async findAll(user: User) {
    return this.listRepository.find({
      where: { owner: { id: user.id } },
      relations: ['owner'],
    });
  }

  async update(id: number, dto: UpdateListDto, user: User) {
    const list = await this.listRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!list) {
      throw new NotFoundException('Not found list');
    }

    if (list.owner.id !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    Object.assign(list, dto);
    return this.listRepository.save(list);
  }

  async remove(id: number, user: User) {
    const list = await this.listRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!list) {
      throw new NotFoundException('Not found list');
    }

    if (list.owner.id !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    await this.listRepository.remove(list);
  }

  async listItems(
    listId: number,
    opts: { withAssignee: boolean },
  ): Promise<ItemResponseDto[]> {
    const exists = await this.listRepository.exist({ where: { id: listId } });
    if (!exists) throw new NotFoundException('LIST_NOT_FOUND');

    const qb = this.itemRepo
      .createQueryBuilder('i')
      .where('i.list_id = :listId', { listId });

    if (opts.withAssignee) {
      qb.leftJoinAndSelect('i.assignee', 'assignee');
    }

    const rows = await qb.getMany();

    return rows.map((i) => ({
      id: i.id,
      title: i.title,
      done: i.done,
      assignee:
        opts.withAssignee && i.assignee
          ? {
              id: i.assignee.id as any, // ajuste se seu User.id não for string
              name: (i.assignee as any).name,
              avatarUrl: (i.assignee as any).avatarUrl ?? null,
            }
          : null,
      isAssigned: !!i.assigneeId,
    }));
  }

  async updateItemAssignee(
    listId: number,
    itemId: string,
    assigneeId: string | null,
  ): Promise<ItemResponseDto> {
    const item = await this.itemRepo.findOne({ where: { id: itemId, listId } });
    if (!item) throw new NotFoundException('ITEM_NOT_FOUND');

    item.assigneeId = assigneeId ?? null;
    await this.itemRepo.save(item);

    const updated = await this.itemRepo.findOne({
      where: { id: itemId },
      relations: ['assignee'],
    });

    return {
      id: updated.id,
      title: updated.title,
      done: updated.done,
      assignee: updated.assignee
        ? {
            id: updated.assignee.id as any,
            name: (updated.assignee as any).name,
            avatarUrl: (updated.assignee as any).avatarUrl ?? null,
          }
        : null,
      isAssigned: !!updated.assigneeId,
    };
  }
}
