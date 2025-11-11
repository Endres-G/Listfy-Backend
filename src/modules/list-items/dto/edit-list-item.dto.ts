import { PartialType } from '@nestjs/swagger';
import { CreateListItemDto } from './create-list-item.dto';

export class EditListItemDto extends PartialType(CreateListItemDto) {}
