import { Controller, Get } from '@nestjs/common';
import { BlueprintsService } from './blueprints.service';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProperty,
} from '@nestjs/swagger';
import { ResponseDto } from './dto/Response.dto';

@Controller('blueprints')
export class BlueprintsController {
  constructor(private readonly blueprintsService: BlueprintsService) {}

  @Get('analyze')
  @ApiProperty({
    description: 'Provide blueprint quality analysis of the input file',
  })
  @ApiOkResponse({
    description: 'Successfully return quality analysis',
    type: ResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad input',
  })
  @ApiNotFoundResponse({
    description: 'No file to analyze',
  })
  async analyze(): Promise<ResponseDto> {
    return this.blueprintsService.analyzeBlueprints();
  }
}
