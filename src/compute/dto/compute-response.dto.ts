import { ApiProperty } from '@nestjs/swagger';

export class Result {
  @ApiProperty({ example: 1 })
  index: number;
  @ApiProperty({ example: 2 })
  result: number;
}

export class ComputeResponseDto {
  @ApiProperty({ type: Result, isArray: true })
  results: Result[];

  constructor(results: Result[]) {
    this.results = results;
  }
}
