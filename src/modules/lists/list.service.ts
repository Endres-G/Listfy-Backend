import {
  ConflictException,
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
import { AddListMemberDto } from './dto/add-list-member.dto';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateListDto, user: User) {
    const list = this.listRepository.create({
      ...dto,
      owner: user,
      users: [user],
    });
    return this.listRepository.save(list);
  }

  async findAll(user: User) {
    const userId = user.id;

    return this.listRepository
      .createQueryBuilder('list')
      .leftJoinAndSelect('list.owner', 'owner')
      .leftJoinAndSelect('list.users', 'users')
      .where('owner.id = :userId', { userId })
      .orWhere('users.id = :userId', { userId })
      .getMany();
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

  async addMember(listId: number, dto: AddListMemberDto, user: User) {
    const list = await this.listRepository.findOne({
      where: { id: listId },
      relations: ['owner', 'users'],
    });

    if (!list) {
      throw new NotFoundException('Not found list');
    }

    if (list.owner.id !== user.id) {
      throw new ForbiddenException('Only the owner can add members');
    }

    const alreadyMember = list.users.some((member) => member.id === dto.userId);
    if (alreadyMember) {
      throw new ConflictException('The user is already a member of the list');
    }

    const newMember = await this.userRepository.findOne({ where: { id: dto.userId } });
    if (!newMember) {
      throw new NotFoundException('User not found');
    }

    list.users.push(newMember);
    return this.listRepository.save(list);
  }
}
