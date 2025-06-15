import { ApiProperty } from '@nestjs/swagger';

export class ResultDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 2 })
  quality: number;

  constructor(id: number, quality: number) {
    this.id = id;
    this.quality = quality;
  }
}

export class ResponseDto {
  @ApiProperty({ example: 1 })
  bestBlueprint: number;

  @ApiProperty({ type: ResultDto, isArray: true })
  results: ResultDto[];

  constructor(bestBlueprint: number, results: ResultDto[]) {
    this.bestBlueprint = bestBlueprint;
    this.results = results;
  }

  asString() {
    // FIXME
    return '';
  }
}
