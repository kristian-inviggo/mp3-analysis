import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('health')
export class HealthController {
  @ApiOkResponse({
    description: 'Returns OK if the app is running correctly',
  })
  @Get()
  public checkAppHealth(): void {
    return;
  }
}
