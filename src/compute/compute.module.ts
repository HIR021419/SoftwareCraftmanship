import { Module } from '@nestjs/common';
import { ComputeService } from './compute.service';
import { ComputeController } from './compute.controller';
import {ParserModule} from "../parser/parser.module";

@Module({
  imports: [ParserModule],
  controllers: [ComputeController],
  providers: [ComputeService],
})
export class ComputeModule {}
