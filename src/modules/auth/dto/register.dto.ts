import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string;
  @IsNotEmpty()
  @IsString()
  @Length(4, 20)
  readonly password: string;

  @IsString()
  @IsEmail()
  readonly email:string
}
