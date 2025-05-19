import { Transport } from '@nestjs/microservices';

export class ConfigService {
  private readonly envConfig: { [key: string]: any } = {};

  constructor() {
    this.envConfig.service = {
      transport: Transport.TCP,
      options: {
        host: "127.0.0.1",
        port: 3002,
      },
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}