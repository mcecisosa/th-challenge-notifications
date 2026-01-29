import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './notification.entity';
import { DeleteNotificationService } from './application/delete-notification.service';
import { UpdateNotificationService } from './application/update-notification.service';
import { GetNotificationByUserIdService } from './application/get-notification-by-user.service';
import { JwtAuthGuard } from '../auth/infrastructure/jwt-auth.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import type { AuthUser } from '../auth/domain/auth-user';

@ApiTags('Notifications')
@Controller('notifications')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(
    private readonly getNotificationByUserIdService: GetNotificationByUserIdService,
    private readonly updateNotificationService: UpdateNotificationService,
    private readonly deleteNotificationService: DeleteNotificationService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications of the user logged in' })
  @ApiOkResponse({
    description: 'Return all notifications of the user',
    type: Notification,
    isArray: true,
  })
  async getAllByUser(@CurrentUser() user: AuthUser) {
    const notifications = await this.getNotificationByUserIdService.execute(
      user.userId,
    );
    return notifications;
  }
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNotificationDto,
  ): Promise<Notification> {
    const notification = await this.updateNotificationService.execute(id, dto);
    return notification;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiParam({ name: 'id', description: 'The notification id' })
  @ApiOkResponse({
    description: 'The notification has been succesfully deleted',
  })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteNotificationService.execute(id);
  }
}
