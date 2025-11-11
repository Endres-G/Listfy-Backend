import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: dto.email }],
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const configuredSalt = Number(process.env.HASH_SALT ?? 10);
    const saltRounds = Number.isFinite(configuredSalt) && configuredSalt > 0 ? configuredSalt : 10;
    const password = await bcrypt.hash(dto.password, saltRounds);

    const user = this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password,
    });

    const saved = await this.userRepository.save(user);
    return this.toSafeUser(saved);
  }

  findAll() {
    return this.userRepository
      .find()
      .then((users) => users.map((user) => this.toSafeUser(user)));
  }

  async findById(id: number) {
    const user = await this.getUserEntityOrFail(id);
    return this.toSafeUser(user);
  }

  async update(id: number, dto: UpdateUserDto, user: User) {
    if (user.id !== id) {
      throw new ForbiddenException('You cannot update another user');
    }

    const target = await this.getUserEntityOrFail(id);

    if (dto.name !== undefined) {
      target.name = dto.name;
    }

    if (dto.email !== undefined) {
      target.email = dto.email;
    }

    if (dto.password) {
      const salt = Number(process.env.HASH_SALT ?? 10);
      target.password = await bcrypt.hash(dto.password, salt);
    }

    const updated = await this.userRepository.save(target);
    return this.toSafeUser(updated);
  }

  async remove(id: number, user: User) {
    if (user.id !== id) {
      throw new ForbiddenException('You cannot remove another user');
    }

    const target = await this.getUserEntityOrFail(id);
    await this.userRepository.softRemove(target);

    return { message: 'User removed successfully' };
  }

  private async getUserEntityOrFail(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private toSafeUser(user: User): Omit<User, 'password'> {
    const { password, ...safeUser } = user;
    return safeUser;
  }
}
