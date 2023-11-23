import { Controller, Get, Query } from '@nestjs/common';
import { RangeService } from './range.service';

@Controller('range')
export class RangeController {
  constructor(private rangeService: RangeService) {}

  @Get()
  getRange(@Query('range') range: string) {
    return this.rangeService.getRange(range);
  }
}
