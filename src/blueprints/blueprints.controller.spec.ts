import { Test, TestingModule } from '@nestjs/testing';
import { BlueprintsController } from './blueprints.controller';
import { BlueprintsService } from './blueprints.service';

describe('BlueprintsController', () => {
  let controller: BlueprintsController;
  let computeService: BlueprintsService;

  beforeEach(async () => {
    const mockComputeService = {
      compute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlueprintsController],
      providers: [
        {
          provide: BlueprintsService,
          useValue: mockComputeService,
        },
      ],
    }).compile();

    controller = module.get<BlueprintsController>(BlueprintsController);
    computeService = module.get<BlueprintsService>(BlueprintsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('compute', () => {
    it('should call computeService.blueprints with the correct DTO and return result', () => {
      const dto: ComputeRequestDto = { input: 'some input data' };
      const mockResult = [42, 84, 126];

      (computeService.compute as jest.Mock).mockReturnValue(mockResult);

      const result = controller.compute(dto);

      expect(computeService.compute).toHaveBeenCalledWith(dto);
      expect(result).toBe(mockResult);
    });
  });
});
