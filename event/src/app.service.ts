import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

export interface EventInfo {
    id: string,
    condition: string,
    name: string,
    reward: string,
}

export interface EventRequestInfo {
    userid: string,
    requestid: string,
    eventid: string, 
    token: string,
    success: boolean,
}

@Injectable()
export class AppService {
  private readonly jwtService: JwtService;

  constructor(
    @InjectModel('Event') private readonly eventModel: Model<EventInfo>,
    @InjectModel('RewardRequest') private readonly rewardRequestModel: Model<EventRequestInfo>,
  ) {}

  async createEvent({ id, condition, name, reward }: EventInfo): Promise<string> {
    await this.eventModel.create({ id, condition, name, reward });
    return Promise.resolve(`Event ${id} created.`);
  }

  async checkEvent(id: string): Promise<string> {
    const event = await this.eventModel.findOne({ id }).lean();
    if (!event) return Promise.resolve(`Event ${id} not found.`);
    return JSON.stringify(event);
  }

  async editEvent({ id, condition, name, reward }: EventInfo): Promise<string> {
    const res = await this.eventModel.updateOne(
      { id },
      { $set: { condition, name, reward } },
    );
    if (res.matchedCount === 0) return Promise.resolve(`Event ${id} not found.`);
    return `Event ${id} updated.`;
  }

  async requestReward({ userid, requestid, eventid, token }: EventRequestInfo): Promise<string> {
    var res = {
        userid,
        requestid,
        eventid,
        token,
        success: false,
    }

    const prevReq = await this.rewardRequestModel.findOne({id:userid});
    const { id } = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
    }) as { id: string }

    if(id !== userid || (prevReq !== null && prevReq.eventid === eventid)) {
        await this.rewardRequestModel.create(res);
        return Promise.resolve(`Reward request failed: ${requestid}`);
    }

    // check if condition has met. -> 
    /*
    
    if(eventid === 'consecutive-3-days') {
        var user = userModel.findOne('jwt id');
        if user.consecutiveDays >= 3 -> reward given and other stuff. 
    }

    */

    res.success = true;
    await this.rewardRequestModel.create(res);
    return Promise.resolve(`Reward requested: ${requestid}.`);
  }

  async getRewardRequestHistory(id: string): Promise<string> {
    const history = await this.rewardRequestModel.find({ requestid: id }).lean();
    return Promise.resolve(JSON.stringify(history));
  }
}