import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CleanupService } from './cleanup.service';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class CleanupJob {
  constructor(
    private readonly cleanupService: CleanupService,
    private readonly loggerService: LoggerService,
    ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleCleanup(): void {
    this.loggerService.info(`Running cleanup job...`);
    this.cleanupService.cleanupFinancialTables();
    this.cleanupService.cleanupInactiveUsers();
    this.loggerService.info(`Cleanup job done!`);
  }
}
