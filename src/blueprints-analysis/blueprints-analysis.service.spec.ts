import { Test, TestingModule } from '@nestjs/testing';
import { BlueprintsAnalysisService } from './blueprints-analysis.service';
import { ConfigService } from '@nestjs/config';
import { BlueprintDto } from '../blueprints/dto/BlueprintDto';

describe('BlueprintsAnalysisService', () => {
  let service: BlueprintsAnalysisService;

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      if (key === 'algorithm') {
        return {
          max_index: 4,
          ticks: 5,
          max_states: 10,
        };
      }
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlueprintsAnalysisService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<BlueprintsAnalysisService>(BlueprintsAnalysisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('testBlueprint', () => {
    it('should compute a quality score based on blueprint simulation', () => {
      const blueprintDto: BlueprintDto = {
        index: 2,
        robotCosts: [
          [1, 0, 0, 0, 0],
          [0, 1, 0, 0, 0],
        ],
      };

      const result = service.testBlueprint(blueprintDto);
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
    });
  });
});
