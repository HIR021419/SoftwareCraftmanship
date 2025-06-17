import { Module } from '@nestjs/common';
import { BlueprintsModule } from './blueprints/blueprints.module';
import { ParserModule } from './parser/parser.module';
import { FileModule } from './file/file.module';
import { BlueprintsAnalysisModule } from './blueprints-analysis/blueprints-analysis.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    BlueprintsModule,
    ParserModule,
    FileModule,
    BlueprintsAnalysisModule,
  ],
})
export class AppModule {}
