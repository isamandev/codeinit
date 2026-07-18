import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request } from "express";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/sign-up.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { JwtAuthGuard } from "../../shared/guards/jwt-auth.guard";

type JwtUser = { userId: string; email: string };

type RequestWithUser = Omit<Request, "user"> & {
  user: JwtUser;
};

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({ status: 201, description: "User created successfully" })
  @ApiResponse({ status: 400, description: "Email already registered or invalid input" })
  @Post("signup")
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpDto: SignUpDto) {
    const user = await this.authService.signUp(signUpDto);
    return {
      success: true,
      message: "ثبت نام موفقیت‌آمیز بود",
      data: user,
    };
  }

  @ApiOperation({ summary: "Sign in with email and password" })
  @ApiResponse({ status: 200, description: "Signed in successfully, returns a JWT token" })
  @ApiResponse({ status: 400, description: "Invalid input" })
  @ApiResponse({ status: 401, description: "Invalid email or password" })
  @Post("signin")
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto) {
    const user = await this.authService.validateUser(
      signInDto.email,
      signInDto.password,
    );

    const token = this.authService.generateToken(
      user.id,
      user.email,
      user.role,
    );

    return {
      success: true,
      message: "ورود موفقیت‌آمیز بود",
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
    };
  }

  @ApiOperation({ summary: "Get the currently authenticated user" })
  @ApiResponse({ status: 200, description: "Current user retrieved successfully" })
  @ApiResponse({ status: 401, description: "Missing or invalid JWT token" })
  @ApiBearerAuth()
  @Get("me")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getMe(@Req() request: RequestWithUser) {
    const user = await this.authService.getCurrentUser(request.user.userId);
    return {
      success: true,
      data: user,
    };
  }
}
