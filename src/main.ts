import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { ResponseMappingInterceptor } from './common/intercepror/response.map.interceptor';
import { ErrorHandlingInterceptor } from './common/intercepror/errorHandling.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('query parser', 'extended');
  app.useGlobalInterceptors(
    // new ResponseMappingInterceptor(),
    new ErrorHandlingInterceptor(),
  );
  const configService = app.get<ConfigService>(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  const port = configService.get<number>('PORT', 5000);
  console.log(port);
  await app.listen(port); // <-- You missed this line
  console.log(`Ecommerce listen on port:${port}`);
  // const person = { name: 'moamen', age: 32 };
  // const per = { [person.name]: 'abas' };
  // console.log(per);
}
bootstrap();
