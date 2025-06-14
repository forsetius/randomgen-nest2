import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class ContactDto {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;
}
