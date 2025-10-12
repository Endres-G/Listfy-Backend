import { IsEmail, IsIn, IsOptional, IsString } from 'class-validator';
import { CollaboratorRole } from '../entities/list-collaborator.entity';

export class AddCollaboratorDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsIn(['viewer', 'editor'])
  role: CollaboratorRole;
}
