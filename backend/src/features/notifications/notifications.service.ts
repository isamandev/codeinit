import { Injectable, Logger } from "@nestjs/common";
import webPush from "web-push";
import { PrismaService } from "../../shared/prisma/prisma.service";
import {
  PushSubscriptionDto,
  PushSubscriptionKeysDto,
} from "./dto/notifications.dto";

type NotificationPayload = {
  title: string;
  body: string;
  data?: Record<string, unknown>;
};

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prismaService: PrismaService) {
    webPush.setVapidDetails(
      process.env.VAPID_SUBJECT || "mailto:example@example.com",
      process.env.VAPID_PUBLIC_KEY || "",
      process.env.VAPID_PRIVATE_KEY || "",
    );
  }

  // Subscribing does not require a logged-in user, so we identify a
  // subscription by its endpoint (the browser's own push URL) instead of a userId.
  async subscribe(subscription: PushSubscriptionDto) {
    const keys = {
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    };

    const existingSubscription =
      await this.prismaService.pushSubscription.findUnique({
        where: { endpoint: subscription.endpoint },
      });

    if (existingSubscription) {
      await this.prismaService.pushSubscription.update({
        where: { id: existingSubscription.id },
        data: { active: true, keys },
      });
      this.logger.log(`Subscription re-activated: ${subscription.endpoint}`);
      return;
    }

    await this.prismaService.pushSubscription.create({
      data: {
        endpoint: subscription.endpoint,
        keys,
        active: true,
      },
    });
    this.logger.log(`New subscription saved: ${subscription.endpoint}`);
  }

  async unsubscribe(endpoint: string) {
    await this.prismaService.pushSubscription.deleteMany({
      where: { endpoint },
    });
    this.logger.log(`Subscription removed: ${endpoint}`);
  }

  async notifySubscribers(payload: NotificationPayload) {
    const subscriptions = await this.prismaService.pushSubscription.findMany({
      where: { active: true },
    });

    for (const subscription of subscriptions) {
      await this.sendPushNotification(subscription, payload);
    }

    return { notifiedCount: subscriptions.length };
  }

  private async sendPushNotification(
    subscription: { id: string; endpoint: string; keys: unknown },
    payload: NotificationPayload,
  ) {
    try {
      await webPush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: subscription.keys as PushSubscriptionKeysDto,
        },
        JSON.stringify(payload),
      );
    } catch (error) {
      // 410 Gone means the browser subscription no longer exists, so we stop
      // sending to it instead of retrying forever.
      if (
        typeof error === "object" &&
        error !== null &&
        "statusCode" in error &&
        error.statusCode === 410
      ) {
        await this.prismaService.pushSubscription.update({
          where: { id: subscription.id },
          data: { active: false },
        });
        return;
      }

      this.logger.error(
        `Failed to send notification to ${subscription.endpoint}`,
        error,
      );
    }
  }
}
