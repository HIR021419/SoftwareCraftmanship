import { Body, Controller, Post } from '@nestjs/common';
import { ComputeService } from './compute.service';
import { ComputeRequestDto } from './dto/compute-request.dto';

@Controller('compute')
export class ComputeController {
    constructor(private readonly computeService: ComputeService) {}

    @Post()
    compute(@Body() computeRequestDto: ComputeRequestDto) {
        return this.computeService.compute(computeRequestDto);
    }
}
