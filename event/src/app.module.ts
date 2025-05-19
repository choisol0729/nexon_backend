import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { EventRequestSchema, EventSchema } from './event.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI ?? 'mongodb://localhost:27017/',
        {
            dbName: 'nexon_back_db'
        }
    ),

    MongooseModule.forFeature([
        { name: 'Event', schema: EventSchema },
        { name: 'RewardRequest', schema: EventRequestSchema },
    ]),
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}