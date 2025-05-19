import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientProxyFactory } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from './config/config.service'; //

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        JwtModule.register({
            secret: process.env.JWT_SECRET ?? 'dev_secret',
        })
    ],
    controllers: [AppController],
    providers: [
        ConfigService,
        {
            provide: 'AUTH_SERVICE',
            useFactory: (configService: ConfigService) => {
                const options = configService.get('authService');
                return ClientProxyFactory.create(options);
            },
            inject: [ConfigService],
        },
        {
            provide: 'EVENT_SERVICE',
            useFactory: (configService: ConfigService) => {
                const options = configService.get('eventService');
                return ClientProxyFactory.create(options);
            },
            inject: [ConfigService],
        },
        AppService,
    ],
})
export class AppModule {}
