import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import * as process from 'node:process';

const example = process.env.INPUT_EXAMPLE;

export class ComputeRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example })
  input: string;
}
