import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class PushSubscriptionKeysDto {
  @ApiProperty({ description: "P256DH public key for the push subscription" })
  @IsString()
  @IsNotEmpty()
  p256dh!: string;

  @ApiProperty({ description: "Auth secret for the push subscription" })
  @IsString()
  @IsNotEmpty()
  auth!: string;
}

export class PushSubscriptionDto {
  @ApiProperty({ description: "Push service endpoint URL" })
  @IsString()
  @IsNotEmpty()
  endpoint!: string;

  @ApiProperty({ type: () => PushSubscriptionKeysDto, description: "Push subscription encryption keys" })
  @ValidateNested()
  @Type(() => PushSubscriptionKeysDto)
  keys!: PushSubscriptionKeysDto;

  @ApiProperty({
    description: "Expiration time of the push subscription, if any",
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  expirationTime?: number | null;
}

export class SubscribeDto {
  @ApiProperty({ type: () => PushSubscriptionDto, description: "Browser push subscription to register" })
  @ValidateNested()
  @Type(() => PushSubscriptionDto)
  subscription!: PushSubscriptionDto;
}

export class UnsubscribeDto {
  @ApiProperty({ description: "Push service endpoint URL to unsubscribe" })
  @IsString()
  @IsNotEmpty()
  endpoint!: string;
}
