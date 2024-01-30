import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CleanupJob } from './shared/cleanup/cleanup.job';
import { CleanupService } from './shared/cleanup/cleanup.service';
import { LoggerService } from './shared/logger/logger.service';

async function startApp() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  const scheduler = app.get(SchedulerRegistry);
  const cleanupJobInstance = new CleanupJob(
    app.get(CleanupService),
    app.get(LoggerService),
  );

  scheduler.addCronJob('cleanup', cleanupJobInstance.handleCleanup.bind(cleanupJobInstance));

  await app.listen(3000);
}
startApp();
