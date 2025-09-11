import { Module } from '@nestjs/common';
import { SQSService } from '../services/sqs.service';

@Module({
  providers: [SQSService],
  exports: [SQSService],
})
export class SQSModule {}
