import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Notifications API')
    .setDescription('The Notificactions API')
    .setVersion('1.0')
    .addTag('notifications')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'jwt',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

//transform: true
//Convierte tipos automáticamente
// @Param('id') id: number
// Sin transform → id es string "5"
// Con transform → id es number 5
// evita Number(id)
// evita bugs silenciosos

// Tabla real de comportamiento
// whitelist	forbidNonWhitelisted	Resultado
// false	        false	            Acepta todo
// true	          false	            Elimina campos extra
// true	          true	            Error 400
// false	        true	            NO sirve (ignorado)
