import { Test, TestingModule } from '@nestjs/testing';
import { BlueprintsService } from './blueprints.service';
import { ParserService } from '../parser/parser.service';
import { Blueprint } from '../blueprints-analysis/models/blueprint';
import { State } from '../blueprints-analysis/models/state';

describe('BlueprintsService', () => {
  let service: BlueprintsService;
  let parserService: ParserService;

  // Mock minimal Blueprint & Robot behavior
  const mockBlueprint: Blueprint = new Blueprint(1, [
    [1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
  ]);
  // Mock the robots getter to return robots with stubbed addRobot method
  jest.spyOn(mockBlueprint, 'robots', 'get').mockReturnValue([
    {
      addRobot: jest.fn().mockImplementation((state: State) => {
        const newState = state.clone();
        newState.resources[0] = Math.max(0, newState.resources[0] - 1);
        return newState;
      }),
    } as any,
    {
      addRobot: jest.fn().mockImplementation((state: State) => {
        const newState = state.clone();
        newState.resources[1] = Math.max(0, newState.resources[1] - 1);
        return newState;
      }),
    } as any,
  ]);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlueprintsService,
        {
          provide: ParserService,
          useValue: {
            parse: jest.fn().mockReturnValue([mockBlueprint]),
          },
        },
      ],
    }).compile();

    service = module.get<BlueprintsService>(BlueprintsService);
    parserService = module.get<ParserService>(ParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('compute', () => {
    it('should read input from dto and parse blueprints', () => {
      const dto = { input: 'line1\nline2\nline3' };
      const parseSpy = jest.spyOn(parserService, 'parse');
      const results = service.compute(dto).results;

      expect(parseSpy).toHaveBeenCalledWith({
        lines: ['line1', 'line2', 'line3'],
      });
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });

    it('should read input from file if dto.input is empty', () => {
      // Mock fs.readFileSync to avoid real file access
      jest
        .spyOn(require('fs'), 'readFileSync')
        .mockReturnValue('fileline1\nfileline2');
      const dto = { input: '' };
      const parseSpy = jest.spyOn(parserService, 'parse');
      const results = service.compute(dto).results;

      expect(parseSpy).toHaveBeenCalledWith({
        lines: ['fileline1', 'fileline2'],
      });
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('processBlueprints', () => {
    it('should return a Response with results', () => {
      const blueprints = [mockBlueprint];
      const response = service.processBlueprints(blueprints);

      expect(response.results.length).toBe(1);
      expect(response.results[0].index).toBe(mockBlueprint.index);
      expect(typeof response.results[0].result).toBe('number');
    });
  });

  describe('private methods', () => {
    it('testBlueprint returns a number based on blueprint index and states', () => {
      // testBlueprint is private, but processBlueprints calls it, so we test indirectly
      const blueprints = [mockBlueprint];
      const response = service.processBlueprints(blueprints);

      expect(typeof response.results[0].result).toBe('number');
    });

    it('getMax returns max resource count or 0 if empty', () => {
      const getMax = (service as any).getMax.bind(service);

      const statesWithResources = [
        { getResource: () => 2 },
        { getResource: () => 5 },
        { getResource: () => 3 },
      ];
      expect(getMax(statesWithResources)).toBe(5);

      expect(getMax([])).toBe(0);
    });
  });
});
