import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

interface JwtUser {
  userId: string;
  email: string;
}

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard("jwt") {
  handleRequest<TUser = JwtUser | null>(_err: unknown, user: TUser): TUser {
    return user ?? (null as TUser);
  }
}
