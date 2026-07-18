import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { NotificationsService } from "./notifications.service";
import { SubscribeDto, UnsubscribeDto } from "./dto/notifications.dto";

@ApiTags("Notifications")
@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({ summary: "Register a browser push subscription" })
  @ApiResponse({ status: 200, description: "Subscribed successfully" })
  @ApiResponse({ status: 400, description: "Invalid subscription payload" })
  @Post("subscribe")
  @HttpCode(HttpStatus.OK)
  async subscribe(@Body() body: SubscribeDto) {
    await this.notificationsService.subscribe(body.subscription);
    return { message: "Subscribed successfully" };
  }

  @ApiOperation({ summary: "Remove a browser push subscription" })
  @ApiResponse({ status: 200, description: "Unsubscribed successfully" })
  @ApiResponse({ status: 400, description: "Invalid endpoint" })
  @Post("unsubscribe")
  @HttpCode(HttpStatus.OK)
  async unsubscribe(@Body() body: UnsubscribeDto) {
    await this.notificationsService.unsubscribe(body.endpoint);
    return { message: "Unsubscribed successfully" };
  }

  // Development helper for manually verifying delivery end-to-end.
  @ApiOperation({ summary: "Send a test push notification to all subscribers" })
  @ApiResponse({ status: 200, description: "Test notification dispatched" })
  @Post("test-send")
  @HttpCode(HttpStatus.OK)
  async sendTestNotification() {
    return this.notificationsService.notifySubscribers({
      title: "Test notification",
      body: "This is a test notification sent from the backend.",
    });
  }
}
