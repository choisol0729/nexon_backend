import { Transport } from '@nestjs/microservices';

export class ConfigService {
  private readonly envConfig: { [key: string]: any } = {};

  constructor() {
    const {
      GATEWAY_PORT = '3000',
      HOST = '127.0.0.1',
      AUTH_SERVICE = 'AUTH_SERVICE',
      AUTH_PORT = '3001',
      EVENT_SERVICE = 'EVENT_SERVICE',
      EVENT_PORT = '3002',
    } = process.env;

    this.envConfig.port = Number(GATEWAY_PORT);
    this.envConfig.host = HOST;

    this.envConfig.authService = {
      name: AUTH_SERVICE,
      transport: Transport.TCP,
      options: {
        host: HOST,
        port: Number(AUTH_PORT),
      },
    };

    this.envConfig.eventService = {
      name: EVENT_SERVICE,
      transport: Transport.TCP,
      options: {
        host: HOST,
        port: Number(EVENT_PORT),
      },
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}