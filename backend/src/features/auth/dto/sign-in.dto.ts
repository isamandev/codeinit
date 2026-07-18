import { IsEmail, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignInDto {
  @ApiProperty({ example: "user@example.com", description: "User email address" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "password123", minLength: 6, description: "User password, minimum 6 characters" })
  @IsString()
  @MinLength(6)
  password!: string;
}
