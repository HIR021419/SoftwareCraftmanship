import { Module } from '@nestjs/common';
import { BlueprintsService } from './blueprints.service';
import { BlueprintsController } from './blueprints.controller';
import { ParserModule } from '../parser/parser.module';
import { FileModule } from '../file/file.module';
import { BlueprintsAnalysisModule } from '../blueprints-analysis/blueprints-analysis.module';

@Module({
  imports: [ParserModule, FileModule, BlueprintsAnalysisModule],
  controllers: [BlueprintsController],
  providers: [BlueprintsService],
})
export class BlueprintsModule {}
