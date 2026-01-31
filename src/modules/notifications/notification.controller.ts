import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
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
import { CreateNotificationDto } from './dto/create-notification.dto';
import { CreateNotificationService } from './application/create-notification.service';

@ApiTags('Notifications')
@Controller('notifications')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(
    private readonly createNotificationService: CreateNotificationService,
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

  @Post()
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiBody({ type: CreateNotificationDto })
  @ApiCreatedResponse({
    description: 'The notification has been succesfully created',
    type: Notification,
  })
  async create(
    @Body() dto: CreateNotificationDto,
    @CurrentUser() user: AuthUser,
  ): Promise<Notification> {
    const notification = await this.createNotificationService.execute({
      ...dto,
      currUserId: user.userId,
    });
    return notification;
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
