import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getCheck(): string {
    return '{check: gateway}';
  }
}
