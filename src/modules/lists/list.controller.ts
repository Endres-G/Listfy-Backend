import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UpdateListDto } from './dto/update-list.dto';
import { CreateListDto } from './dto/create-list.dto';
import { ApiTags } from '@nestjs/swagger';
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
    @Param('id') id: number,
    @Body() dto: UpdateListDto,
    @GetUser() user: User,
  ) {
    return this.listService.update(id, dto, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @GetUser() user: User) {
    return this.listService.remove(id, user);
  }
}
