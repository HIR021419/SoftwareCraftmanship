import { Body, Controller, Post } from '@nestjs/common';
import { ComputeService } from './compute.service';
import { ComputeRequestDto } from './dto/compute-request.dto';
import { ComputeResponseDto } from './dto/compute-response.dto';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('compute')
export class ComputeController {
  constructor(private readonly computeService: ComputeService) {}

  @Post()
  @ApiOperation({ summary: 'Runs the computation' })
  @ApiOkResponse({ type: ComputeResponseDto })
  @ApiBadRequestResponse()
  compute(@Body() computeRequestDto: ComputeRequestDto): ComputeResponseDto {
    return this.computeService.compute(computeRequestDto);
  }
}
