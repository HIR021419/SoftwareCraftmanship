import { Test, TestingModule } from '@nestjs/testing';
import { BlueprintsController } from './blueprints.controller';
import { BlueprintsService } from './blueprints.service';
import { ResponseDto, ResultDto } from './dto/Response.dto';

describe('BlueprintsController', () => {
  let controller: BlueprintsController;
  let blueprintsService: BlueprintsService;

  beforeEach(async () => {
    const mockService = {
      analyzeBlueprints: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlueprintsController],
      providers: [
        {
          provide: BlueprintsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<BlueprintsController>(BlueprintsController);
    blueprintsService = module.get<BlueprintsService>(BlueprintsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('analyze', () => {
    it('should return analysis result from service', async () => {
      const mockResponse = new ResponseDto(1, [
        new ResultDto(1, 10),
        new ResultDto(2, 7),
      ]);

      (blueprintsService.analyzeBlueprints as jest.Mock).mockResolvedValue(
        mockResponse,
      );

      const result = await controller.analyze();

      expect(blueprintsService.analyzeBlueprints).toHaveBeenCalled();
      expect(result).toBe(mockResponse);
    });
  });
});
