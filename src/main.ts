import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');

  const logger = new ConsoleLogger('Main');

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(appConfig?.api_prefix ?? '');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Software Craftsmanship')
    .setDescription(
      'Public REST API for the Software Craftsmanship course, MTI 2026.',
    )
    .setVersion('0.1')
    .build();

  const theme = new SwaggerTheme();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, document, {
    customCss: theme.getBuffer(
      appConfig?.swagger_theme ?? SwaggerThemeNameEnum.CLASSIC,
    ),
    customSiteTitle: 'Software Craftsmanship',
  });

  const port: number = appConfig?.port ?? 3000;
  await app.listen(port);

  logger.log(`🚀 Swagger available at http://localhost:${port}/api`);
}

void bootstrap();
