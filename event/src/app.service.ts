import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';

export interface EventInfo {
    id: string,
    condition: string,
    name: string,
    reward: string,
}

export interface EventRequestInfo {
    requestid: string,
    eventid: string, 
    token: string
}

// Mongoose‑hydrated documents that merge ours with mongoose’s base Document
export type EventDocument = Document & EventInfo;
export type RewardRequestDocument = Document & EventRequestInfo;

@Injectable()
export class AppService {
  constructor(
    @InjectModel('Event') private readonly eventModel: Model<EventDocument>,
    @InjectModel('RewardRequest') private readonly rewardRequestModel: Model<RewardRequestDocument>,
  ) {}

  async createEvent({ id, condition, name, reward }: EventInfo): Promise<string> {
    await this.eventModel.create({ id, condition, name, reward });
    return `Event ${id} created.`;
  }

  async checkEvent(id: string): Promise<string> {
    const event = await this.eventModel.findOne({ id }).lean();
    if (!event) throw new NotFoundException(`Event ${id} not found.`);
    return JSON.stringify(event);
  }

  async editEvent({ id, condition, name, reward }: EventInfo): Promise<string> {
    const res = await this.eventModel.updateOne(
      { id },
      { $set: { condition, name, reward } },
    );
    if (res.matchedCount === 0) throw new NotFoundException(`Event ${id} not found.`);
    return `Event ${id} updated.`;
  }

  async requestReward({ requestid, eventid, token }: EventRequestInfo): Promise<string> {
    await this.rewardRequestModel.create({
      requestid,
      eventid,
      token,
      requestedAt: new Date(),
    });
    return `Reward request ${requestid} stored.`;
  }

  /* Get all reward requests with the given requestid ----------------------------------- */
  async getRewardRequestHistory(id: string): Promise<string> {
    const history = await this.rewardRequestModel.find({ requestid: id }).lean();
    return JSON.stringify(history);
  }
}