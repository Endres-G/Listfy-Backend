import { ApiProperty } from '@nestjs/swagger';
import { IsInt} from 'class-validator';

export class AddListMemberDto {
  @ApiProperty()
  @IsInt()
  userId: number;
}
