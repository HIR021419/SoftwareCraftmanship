import { Test, TestingModule } from '@nestjs/testing';
import { ParserService } from './parser.service';
import { BadRequestException } from '@nestjs/common';
import { ParseBlueprintsInputDto } from './dto/parse-blueprints-input.dto';
import { RobotCostParser } from './robot-cost.parser';

describe('ParserService', () => {
  let service: ParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParserService, RobotCostParser],
    }).compile();

    service = module.get<ParserService>(ParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('parse', () => {
    it('should parse valid blueprint lines correctly', () => {
      const input: ParseBlueprintsInputDto = {
        lines: [
          'Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian. Each diamond robot costs 7 geode and 8 obsidian.',
        ],
      };

      const result = service.parse(input);

      expect(result).toHaveLength(1);
      const blueprint = result[0];
      expect(blueprint.index).toBe(1);
      expect(blueprint.robotCosts).toEqual([
        [4, 0, 0, 0, 0], // ore robot
        [2, 0, 0, 0, 0], // clay robot
        [3, 14, 0, 0, 0], // obsidian robot
        [2, 0, 7, 0, 0], // geode robot
        [0, 0, 8, 7, 0],
      ]);
    });

    it('should skip empty lines', () => {
      const input: ParseBlueprintsInputDto = {
        lines: [
          '',
          'Blueprint 2: Each ore robot costs 1 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 4 clay. Each geode robot costs 5 ore and 6 obsidian.',
          '   ',
        ],
      };

      const result = service.parse(input);

      expect(result).toHaveLength(1);
      expect(result[0].index).toBe(2);
    });

    it('should throw BadRequestException for invalid lines', () => {
      const input: ParseBlueprintsInputDto = {
        lines: ['Invalid input line that does not match the pattern'],
      };

      expect(() => service.parse(input)).toThrow(BadRequestException);
    });
  });
});
