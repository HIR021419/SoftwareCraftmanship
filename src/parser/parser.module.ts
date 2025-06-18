import { Module } from '@nestjs/common';
import { ParserService } from './parser.service';
import { RobotCostParser } from './robot-cost.parser';

@Module({
  providers: [ParserService, RobotCostParser],
  exports: [ParserService],
})
export class ParserModule {}
