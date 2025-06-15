import { Test, TestingModule } from '@nestjs/testing';
import { ComputeController } from './compute.controller';
import { ComputeService } from './compute.service';
import { ComputeRequestDto } from './dto/compute-request.dto';

describe('ComputeController', () => {
  let controller: ComputeController;
  let computeService: ComputeService;

  beforeEach(async () => {
    const mockComputeService = {
      compute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComputeController],
      providers: [
        {
          provide: ComputeService,
          useValue: mockComputeService,
        },
      ],
    }).compile();

    controller = module.get<ComputeController>(ComputeController);
    computeService = module.get<ComputeService>(ComputeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('compute', () => {
    it('should call computeService.compute with the correct DTO and return result', () => {
      const dto: ComputeRequestDto = { input: 'some input data' };
      const mockResult = [42, 84, 126];

      (computeService.compute as jest.Mock).mockReturnValue(mockResult);

      const result = controller.compute(dto);

      expect(computeService.compute).toHaveBeenCalledWith(dto);
      expect(result).toBe(mockResult);
    });
  });
});
