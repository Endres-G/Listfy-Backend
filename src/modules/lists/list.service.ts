import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UpdateListDto } from './dto/update-list.dto';
import { CreateListDto } from './dto/create-list.dto';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
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
}
