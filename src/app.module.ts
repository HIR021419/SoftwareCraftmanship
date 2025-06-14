import { Module } from '@nestjs/common';
import { ComputeModule } from './compute/compute.module';
import { ParserModule } from './parser/parser.module';

@Module({
  imports: [ComputeModule, ParserModule],
})
export class AppModule {}
