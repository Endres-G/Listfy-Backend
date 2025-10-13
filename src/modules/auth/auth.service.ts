import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly listRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(
    username: string,
    password: string,
  ): Promise<{ name: string; access_token: string }> {

    const user = await this.listRepository.findOne({
      where: { name: username },
    });

    if (!user) {
      throw new UnauthorizedException({
        message: 'Usuário ou senha incorretos.',
      });
    }

    const senhaValida = await bcrypt.compare(password, user?.password);

    if (!senhaValida) {
      throw new UnauthorizedException({
        message: 'Usuário ou senha incorretos.',
      });
    }

    const payload = { name: user.name};

    return {
      name: user.name,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(
    username: string,
    email:string,
    password: string,
  ): Promise<{ access_token: string }> {
    try {

      //  Criando hash da senha.
      const salt = Number(process.env.HASH_SALT);
      const hash = await bcrypt.hash(password, salt);

      const user = await this.listRepository.create({
          name: username,
          password: hash,
          email: email
      });

      this.listRepository.save(user);

      if (!user) {
        throw new InternalServerErrorException({
          message: 'Erro ao registrar novo operador.',
        });
      }

      const payload = {
        name: user.name,
      };

    const token= await this.jwtService.signAsync(payload);
      return {
        access_token: token
      };

    } catch {
      throw new InternalServerErrorException({
        message: 'Erro interno.',
        func: 'register()',
      });
    }
  }
}
