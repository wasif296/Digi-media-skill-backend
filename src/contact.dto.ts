import { IsString, IsEmail, IsNotEmpty, IsOptional, IsArray, IsPhoneNumber } from 'class-validator';

export class ContactDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsArray()
  @IsOptional()
  services?: string[];

  @IsString()
  @IsNotEmpty()
  message: string;
}
