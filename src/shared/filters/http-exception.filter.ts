import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { InvalidCredentialsError } from 'src/modules/auth/domain/errors/invalid-credentials.error';
import { NotificationNotFoundError } from 'src/modules/notifications/domain/errors/notification-not-found.error';
import { UserNotFoundError } from 'src/modules/users/domain/errors/user-not-found.error';

//@Catch sin paramentros significa intercepta cualquier error
// ExceptionFilter NO devuelve valores
// Solo escribe en la response
// Siempre : void

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // errores HTTP de nest --> respetarlos
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      return response.status(status).json(res);
    }

    // errores de dominio - 404
    if (exception instanceof UserNotFoundError) {
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: exception.message,
      });
    }

    // errores de dominio - 404
    if (exception instanceof InvalidCredentialsError) {
      return response.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: exception.message,
      });
    }

    if (exception instanceof NotificationNotFoundError) {
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: exception.message,
      });
    }

    //500 - error no controlado o inesperado
    console.log('exception de exc filter', exception);
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    });
  }
}
