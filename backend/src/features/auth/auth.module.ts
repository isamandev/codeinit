import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaService } from "../../shared/prisma/prisma.service";
import { JwtStrategy } from "../../shared/strategies/jwt.strategy";
import { SignOptions } from "jsonwebtoken";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn:
          (process.env.JWT_EXPIRATION as SignOptions["expiresIn"]) ?? "24h",
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
