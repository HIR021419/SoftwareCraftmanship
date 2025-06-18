import { Test, TestingModule } from '@nestjs/testing';
import { BlueprintsService } from './blueprints.service';
import { ParserService } from '../parser/parser.service';
import { FileService } from '../file/file.service';
import { ConfigService } from '@nestjs/config';
import { BlueprintsAnalysisService } from '../blueprints-analysis/blueprints-analysis.service';
import { BlueprintDto } from './dto/BlueprintDto';
import { ResultDto } from './dto/Response.dto';

describe('BlueprintsService', () => {
  let service: BlueprintsService;
  let parserService: ParserService;
  let fileService: FileService;
  let configService: ConfigService;
  let analysisService: BlueprintsAnalysisService;

  const mockBlueprints: BlueprintDto[] = [
    new BlueprintDto(1, [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
    ]),
  ];

  const mockResults: ResultDto[] = [new ResultDto(1, 10)];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlueprintsService,
        {
          provide: ParserService,
          useValue: {
            parse: jest.fn().mockReturnValue(mockBlueprints),
          },
        },
        {
          provide: FileService,
          useValue: {
            readFileAsInput: jest
              .fn()
              .mockResolvedValue({ lines: ['some', 'lines'] }),
            writeTextToFile: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: BlueprintsAnalysisService,
          useValue: {
            testBlueprint: jest.fn().mockImplementation((bp: BlueprintDto) => {
              return mockResults.find((r) => r.id === bp.index)?.quality ?? 0;
            }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue({
              input_path: 'input.txt',
              output_path: 'output.txt',
            }),
          },
        },
      ],
    }).compile();

    service = module.get<BlueprintsService>(BlueprintsService);
    parserService = module.get<ParserService>(ParserService);
    fileService = module.get<FileService>(FileService);
    configService = module.get<ConfigService>(ConfigService);
    analysisService = module.get<BlueprintsAnalysisService>(
      BlueprintsAnalysisService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('analyzeBlueprints', () => {
    it('should parse input, analyze blueprints, write to file and return response', async () => {
      const response = await service.analyzeBlueprints();

      expect(fileService.readFileAsInput).toHaveBeenCalledWith('input.txt');
      expect(parserService.parse).toHaveBeenCalledWith({
        lines: ['some', 'lines'],
      });
      expect(analysisService.testBlueprint).toHaveBeenCalledTimes(
        mockBlueprints.length,
      );
      expect(fileService.writeTextToFile).toHaveBeenCalledWith(
        'output.txt',
        expect.stringContaining('Blueprint 1: 10'),
      );

      expect(response.bestBlueprint).toBe(1);
      expect(response.results.length).toBe(1);
      expect(response.results[0].id).toBe(1);
      expect(response.results[0].quality).toBe(10);
    });

    it('should handle empty results gracefully', async () => {
      (parserService.parse as jest.Mock).mockReturnValueOnce([]);

      const response = await service.analyzeBlueprints();

      expect(response.bestBlueprint).toBe(-1);
      expect(response.results.length).toBe(0);
    });
  });
});
