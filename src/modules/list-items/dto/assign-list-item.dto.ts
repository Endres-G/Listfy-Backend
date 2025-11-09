import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class AssignListItemDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  userId: number;
}
