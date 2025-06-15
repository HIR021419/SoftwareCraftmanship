import { Module } from '@nestjs/common';
import { BlueprintsService } from './blueprints.service';
import { BlueprintsController } from './blueprints.controller';
import { ParserModule } from '../parser/parser.module';
import { FileModule } from '../file/file.module';

@Module({
  imports: [ParserModule, FileModule],
  controllers: [BlueprintsController],
  providers: [BlueprintsService],
})
export class BlueprintsModule {}
