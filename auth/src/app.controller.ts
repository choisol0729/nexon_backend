import { Controller } from '@nestjs/common';
import { AppService, UserInfo } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'register' })
  register(@Payload() info: UserInfo): Promise<string> {
    return this.appService.register(info);
  }

  @MessagePattern({ cmd: 'login' })
  login(@Payload() info: UserInfo): Promise<string> {
    return this.appService.login(info);
  }

  @MessagePattern({ cmd: 'profile' })
  profile(token: string): string {
    return this.appService.profile(token);
  }

  @MessagePattern({ cmd: 'checkRole' })
  checkRole(id: string): string {
    return this.appService.checkRole(id);
  }
}
