import { Controller, Get, Version, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Excluded from both the /api prefix and versioning: this is an infra
  // healthcheck hit directly (see backend/Dockerfile.prod), not a client API call.
  @ApiOperation({ summary: 'Infra healthcheck endpoint (not under /api/v1)' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  @Version(VERSION_NEUTRAL)
  @Get('/health')
  getHealth() {
    return this.appService.getHealth();
  }

  @ApiOperation({ summary: 'Get application status' })
  @ApiResponse({ status: 200, description: 'Status retrieved successfully' })
  @Get('status')
  getStatus() {
    return this.appService.getStatus();
  }
}
