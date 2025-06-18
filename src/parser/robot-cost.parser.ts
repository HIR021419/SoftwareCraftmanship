import { Injectable } from '@nestjs/common';
import { ResourceType } from './resource-type.enum';

@Injectable()
export class RobotCostParser {
  parseLine(line: string): [number, number[][]] {
    const parts = line
      .split(/[.:]+/)
      .map((p) => p.trim())
      .filter((p) => p);

    const indexMatch = parts[0].match(/^Blueprint (\d+)$/);
    if (!indexMatch) {
      throw new Error(`Missing or invalid blueprint index`);
    }

    const index = parseInt(indexMatch[1]);
    const robotCosts: number[][] = Array.from({ length: 5 }, () =>
      new Array<number>(5).fill(0),
    );

    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      const { type, costs } = this.parseRobotCost(part);
      robotCosts[type] = costs;
    }

    return [index, robotCosts];
  }

  private parseRobotCost(input: string): {
    type: ResourceType;
    costs: number[];
  } {
    const [robotPart, costPart] = input.split(' costs ');
    const robotMatch = robotPart.match(/^Each (\w+) robot$/);

    if (!robotMatch || !costPart) {
      throw new Error(`Invalid robot cost line: "${input}"`);
    }

    const type = this.getResourceType(robotMatch[1]);
    const costArray = new Array<number>(5).fill(0);

    const costs = costPart.split(' and ');
    for (const cost of costs) {
      const [amountStr, resourceStr] = cost.trim().split(/[\s,]+/);
      const resourceType = this.getResourceType(resourceStr);
      costArray[resourceType] = parseInt(amountStr);
    }

    return { type, costs: costArray };
  }

  private getResourceType(name: string): ResourceType {
    switch (name.toLowerCase()) {
      case 'ore':
        return ResourceType.ORE;
      case 'clay':
        return ResourceType.CLAY;
      case 'obsidian':
        return ResourceType.OBSIDIAN;
      case 'geode':
        return ResourceType.GEODE;
      case 'diamond':
        return ResourceType.DIAMOND;
      default:
        throw new Error(`Unknown resource type: ${name}`);
    }
  }
}
