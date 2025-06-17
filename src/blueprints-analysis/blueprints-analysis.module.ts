import { Module } from '@nestjs/common';
import { BlueprintsAnalysisService } from './blueprints-analysis.service';

@Module({
  providers: [BlueprintsAnalysisService],
  exports: [BlueprintsAnalysisService],
})
export class BlueprintsAnalysisModule {}
