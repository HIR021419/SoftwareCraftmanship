import { Controller, Get } from '@nestjs/common';
import { BlueprintsService } from './blueprints.service';

@Controller('blueprints')
export class BlueprintsController {
  constructor(private readonly blueprintsService: BlueprintsService) {}

  @Get('analyze')
  analyze() {
    return this.blueprintsService.analyzeBlueprints();
  }
}
