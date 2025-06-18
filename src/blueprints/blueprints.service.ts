import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ParserService } from '../parser/parser.service';
import { ResponseDto, ResultDto } from './dto/Response.dto';
import { FileService } from '../file/file.service';
import { BlueprintsAnalysisService } from '../blueprints-analysis/blueprints-analysis.service';
import { BlueprintDto } from './dto/BlueprintDto';
import { ConfigService } from '@nestjs/config';
import { FilesConfig } from '../config/configuration';

@Injectable()
export class BlueprintsService {
  private readonly logger = new ConsoleLogger(BlueprintsService.name);

  constructor(
    private readonly parserService: ParserService,
    private readonly fileService: FileService,
    private readonly blueprintsAnalysisService: BlueprintsAnalysisService,
    private readonly configService: ConfigService,
  ) {}

  public async analyzeBlueprints() {
    const filesConfig = this.configService.get<FilesConfig>('files');

    const inputPath = filesConfig?.input_path ?? './input.txt';
    const inputData = await this.fileService.readFileAsInput(inputPath);

    const blueprints: BlueprintDto[] = this.parserService.parse(inputData);

    const results = blueprints.map((bp) => {
      const quality = this.blueprintsAnalysisService.testBlueprint(bp);
      return new ResultDto(bp.index, quality);
    });

    let bestBlueprint: ResultDto | null = null;

    // Avoid reducing an empty array.
    if (results.length !== 0) {
      bestBlueprint = results.reduce((best, current) =>
        current.quality > best.quality ? current : best,
      );
    }

    const response = new ResponseDto(bestBlueprint?.id ?? -1, results);
    await this.fileService.writeTextToFile(
      filesConfig?.output_path ?? './analysis.txt',
      response.asString(),
    );

    this.logger.log(response.asString());

    return response;
  }
}
