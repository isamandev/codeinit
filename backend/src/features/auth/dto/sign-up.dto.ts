import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignUpDto {
  @ApiProperty({ example: "user@example.com", description: "User email address" })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: "password123", minLength: 6, description: "User password, minimum 6 characters" })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password!: string;

  @ApiProperty({ example: "John Doe", description: "User full name" })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
