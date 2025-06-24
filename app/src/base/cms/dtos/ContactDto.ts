import { IsString, IsNotEmpty, IsEmail, IsEmpty } from 'class-validator';

export class ContactDto {
  // Honeypot field. Invisible in the UI but some bots will fill it.
  @IsString()
  @IsEmpty()
  catcher: string | undefined;

  @IsString()
  @IsNotEmpty()
  name!: string;

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
