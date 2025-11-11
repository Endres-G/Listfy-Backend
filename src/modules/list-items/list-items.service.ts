import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListItem } from './entities/list-item.entity';
import { List } from '../lists/entities/list.entity';
import { User } from '../users/entities/user.entity';
import { CreateListItemDto } from './dto/create-list-item.dto';
import { AssignListItemDto } from './dto/assign-list-item.dto';

@Injectable()
export class ListItemsService {
  constructor(
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(listId: number, dto: CreateListItemDto, user: User) {
    const list = await this.getListOrFail(listId, user);

    const existingItem = await this.listItemRepository.findOne({
      where: { list: { id: list.id }, name: dto.name },
    });

    if (existingItem) {
      throw new ConflictException('Item já cadastrado nessa lista');
    }

    const item = this.listItemRepository.create({
      ...dto,
      quantity: dto.quantity ?? 1,
      list,
    });

    return this.listItemRepository.save(item);
  }

  async assign(listId: number, itemId: number, dto: AssignListItemDto, user: User) {
    const list = await this.getListOrFail(listId, user);

    const item = await this.listItemRepository.findOne({
      where: { id: itemId, list: { id: listId } },
      relations: ['assignedTo'],
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    if (item.assignedTo) {
      throw new ConflictException('Item already assigned to another user');
    }

    const assignee = await this.userRepository.findOne({
      where: { id: dto.userId },
    });

    if (!assignee) {
      throw new NotFoundException('User not found');
    }

    item.assignedTo = assignee;
    return this.listItemRepository.save(item);
  }

  private async getListOrFail(listId: number, user: User) {
    const list = await this.listRepository.findOne({
      where: { id: listId },
      relations: ['owner', 'users'],
    });

    if (!list) {
      throw new NotFoundException('List not found');
    }

    const requesterId = Number(user?.id);
    const isOwner = Number(list.owner?.id) === requesterId;
    const isMember = list.users?.some((member) => Number(member.id) === requesterId);

    if (!isOwner && !isMember) {
      throw new ForbiddenException('Access denied');
    }

    return list;
  }
}
