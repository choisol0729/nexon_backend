import { Controller, Get } from '@nestjs/common';
import { AppService, EventInfo, EventRequestInfo } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'createEvent'})
  createEvent(@Payload() eventInfo: EventInfo): Promise<string> {
    return this.appService.createEvent(eventInfo);
  }

  @MessagePattern({ cmd: 'checkEvent' })
  checkEvent(id: string): Promise<string> {
    return this.appService.checkEvent(id);
  }

  @MessagePattern({ cmd: 'editEvent' })
  editEvent(eventInfo: EventInfo): Promise<string> {
    return this.appService.editEvent(eventInfo);
  }

  @MessagePattern({ cmd: 'requestReward' })
  requestReward(reqInfo: EventRequestInfo): Promise<string> {
    return this.appService.requestReward(reqInfo);
  }

  @MessagePattern({ cmd: 'getRewardRequestHistory'})
  getRewardRequestHistory(id: string): Promise<string> {
    return this.appService.getRewardRequestHistory(id);
  }
}
