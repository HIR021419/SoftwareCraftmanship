import { Test, TestingModule } from '@nestjs/testing';
import { BlueprintsAnalysisService } from './blueprints-analysis.service';

describe('BlueprintsAnalysisService', () => {
  let service: BlueprintsAnalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlueprintsAnalysisService],
    }).compile();

    service = module.get<BlueprintsAnalysisService>(BlueprintsAnalysisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
