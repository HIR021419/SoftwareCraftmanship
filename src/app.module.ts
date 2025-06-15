import { Module } from '@nestjs/common';
import { BlueprintsModule } from './blueprints/blueprints.module';
import { ParserModule } from './parser/parser.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [BlueprintsModule, ParserModule, FileModule],
})
export class AppModule {}
