import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';
import { ParseBlueprintsInputDto } from '../parser/dto/parse-blueprints-input.dto';

@Injectable()
export class FileService {
  async writeTextToFile(filePath: string, content: string): Promise<void> {
    try {
      await fs.writeFile(filePath, content, { encoding: 'utf-8' });
    } catch (err) {
      console.error(`Error writing file at ${filePath}:`, err);
      throw err;
    }
  }

  async readFileAsInput(filePath: string): Promise<ParseBlueprintsInputDto> {
    try {
      const content = await fs.readFile(filePath, { encoding: 'utf-8' });
      return { lines: content.split('\n') };
    } catch (err) {
      console.error(`Error reading file at ${filePath}:`, err);
      throw new NotFoundException("No file to analyze");
    }
  }
}
