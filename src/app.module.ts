import { Module } from '@nestjs/common';
import { ComputeModule } from './compute/compute.module';
import { ParserModule } from './parser/parser.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [ComputeModule, ParserModule, FileModule],
})
export class AppModule {}
