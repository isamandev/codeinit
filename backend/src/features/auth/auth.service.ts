import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../shared/prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { SignUpDto } from "./dto/sign-up.dto";
import { Role } from "../../generated/enums.js";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: signUpDto.email },
    });

    if (existingUser) {
      throw new BadRequestException("این ایمیل قبلا ثبت شده");
    }

    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: signUpDto.email,
        name: signUpDto.name,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    const token = this.generateToken(user.id, user.email, user.role);

    return { ...user, token };
  }

  async validateUser(email: string, plainPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException("ایمیل یا رمز عبور نادرست است");
    }

    const isPasswordValid = await bcrypt.compare(plainPassword, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("ایمیل یا رمز عبور نادرست است");
    }

    return user;
  }

  generateToken(userId: string, email: string, role: Role): string {
    const payload = { userId, email, role };
    return this.jwtService.sign(payload);
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return user;
  }
}
