import { Controller, Get, Post, Inject, Body, Query, Headers, UseGuards, Header } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, of } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';

enum Role {
    admin,
    operator,
    auditor,
    user,
}

interface UserInfo {
    id: string,
    pw: string,
    role: Role
}

interface EventInfo {
    id: string,
    condition: string,
    name: string,
    reward: string,
}

interface EventRequestInfo {
    userid: string,
    requestid: string,
    eventid: string, 
    token: string,
    success: boolean,
}

@Controller()
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authProxy: ClientProxy,
    @Inject('EVENT_SERVICE')
    private readonly eventProxy: ClientProxy,
    private readonly appService: AppService,
    private readonly jwtService: JwtService
  ) {}

  checkToken(token: string, allowedRoles: Role[] = []): boolean {
    try {
      // Strip possible "Bearer " prefix
      if (token.startsWith('Bearer ')) {
        token = token.slice(7);
      }

      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      // `verify` already throws on expiry; role check is manual
      if (allowedRoles.length && !allowedRoles.includes(Number(payload.role) as Role)) {
        return false;
      }
      return true;
    } catch(err) {
      console.log(err);
      return false;
    }
  }

  // @@@@@@@@@@@@@@ GATEWAY SERVER @@@@@@@@@@@@@@@@@

  @Get()
  getCheck(): string {
    return this.appService.getCheck();
  }

  // @@@@@@@@@@@@@@ AUTH SERVER @@@@@@@@@@@@@@@@@

  @Post('/register')
  authRegister(@Body() info: UserInfo): Observable<string> {
    return this.authProxy.send({cmd: 'register'}, info);
  }

  @Post('/login')
  authLogin(@Body() info: UserInfo): Observable<string> {
    return this.authProxy.send({cmd: 'login'}, info);
  }
  
  @Get('/profile')
  getProfile(@Query('token') token: string): Observable<string> {
    return this.authProxy.send({cmd: 'profile'}, token);
  }

  @Get('/checkRole')
  getRole(@Query('token') token: string): Observable<string> {
    return this.authProxy.send({cmd: 'checkRole'}, token);
  }

  @Post('/changeRole')
  changeRole(@Body() role: Role, @Headers('Authorization') authHeader: string): Observable<string> {
    if(!this.checkToken(authHeader, [Role.admin])) {
        return of("Unauthorized");
    }
    return this.authProxy.send({cmd: 'changeRole'}, role);
  }

  @Post('/changeRoleOf')
  changeRoleOf(@Body() user: UserInfo, @Headers('Authorization') authHeader: string): Observable<string> {
    if(!this.checkToken(authHeader, [Role.admin])) {
        return of("Unauthorized");
    }
    return this.authProxy.send({cmd: 'changeRoleOf'}, user);
  }

  // @@@@@@@@@@@@@@ EVENT SERVER @@@@@@@@@@@@@@@@@

  @Post('/createEvent')
  eventRegister( @Body() event: EventInfo, @Headers('Authorization') authHeader: string): Observable<string> {
    if (!this.checkToken(authHeader, [Role.admin, Role.operator])) {
      return of('Unauthorized');
    }
    return this.eventProxy.send({ cmd: 'createEvent' }, event);
  }

  @Get('/checkEvent')
  getEvent(@Query('id') id: string): Observable<string> {
    return this.eventProxy.send({cmd: 'checkEvent'}, id)
  }

  @Post('/editEvent')
  editEvent( @Body() event: EventInfo, @Headers('Authorization') authHeader: string): Observable<string> {
    if(!this.checkToken(authHeader, [Role.admin, Role.operator])) {
        return of('Unauthorized');
    }
    return this.eventProxy.send({ cmd: 'editEvent' }, event);
  }

  @Post('/requestReward')
  requestReward( @Body('requestInfo') info: EventRequestInfo, @Headers('Authorization') authHeader: string): Observable<string> {
    if(!this.checkToken(authHeader, [Role.user])) {
        return of('Unauthorized');
    }
    return this.eventProxy.send({ cmd: 'requestReward'}, info);
  }

  @Get('/getRewardRequestHistory')
  getRewardRequestHistory( @Query('requestid') id: string, @Headers('Authorization') authHeader: string): Observable<string> {
    if(!this.checkToken(authHeader, [Role.admin, Role.operator, Role.auditor])) {
        return of('Unauthorized');
    }
    return this.eventProxy.send({ cmd: 'getRewardRequestHistory'}, id);
  }
}