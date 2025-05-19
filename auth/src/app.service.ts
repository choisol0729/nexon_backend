import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

export interface UserInfo {
    id: string,
    pw: string,
    role: string,
    consecutiveDay: number,
    lastLoginAt: Date
}

@Injectable()
export class AppService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserInfo>,
    private readonly jwtService: JwtService,
  ) {}

  async login({ id, pw }: UserInfo): Promise<string> {
    const user = await this.userModel.findOne({ id }).exec();
    if (!user) {
      return Promise.resolve('Invalid Credentials.');
    }

    const matches = await bcrypt.compare(pw, user.pw);
    if (!matches) {
      return Promise.resolve('Invalid Credentials.');
    }

    const today    = new Date();                       // e.g. 2025-05-19
    const dateFormat = (d: Date) => d.toISOString().slice(0, 10);

    let consecutiveDay = 1;                            // default

    if (user.lastLoginAt) {
        const diff =
        new Date(dateFormat(today)).getTime() -
        new Date(dateFormat(user.lastLoginAt)).getTime();

        const ONE_DAY = 24 * 60 * 60 * 1000;

        if (diff === ONE_DAY)              // logged in yesterday → +1
            consecutiveDay = user.consecutiveDay + 1;
        else if (diff === 0)               // same day → keep value
            consecutiveDay = user.consecutiveDay;
        // else (gap) → streak resets to 1
    }

    // single atomic update so we never lose a streak in race conditions
    await this.userModel.updateOne(
        { _id: user._id },
        { $set: { lastLoginAt: today, consecutiveDay } },
    );

    const payload = { sub: user._id.toString(), id: user.id, role: user.role };
    
    return this.jwtService.sign(payload);
  }

  async register({ id, pw, role }: UserInfo): Promise<string> {
    const exists = await this.userModel.exists({ id });
    if (exists) {
      return Promise.resolve('User already exists.');
    }

    const hash = await bcrypt.hash(pw, 10);
    const created = new this.userModel({ id, pw: hash, role });
    await created.save();

    const payload = { sub: created._id.toString(), id: created.id, role: created.role };
    
    return this.jwtService.sign(payload);
  }

  profile(token: string): string {
    if (!token) {
      return 'Missing token.';
    }

    // Strip optional "Bearer " prefix for convenience
    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    try {
      const { id, role } = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      }) as { id: string; role: string };

      // Return a lightweight JSON string so the caller can easily parse
      return JSON.stringify({ id, role });
    } catch {
      return 'Invalid or expired token.';
    }
  }

  checkRole(id: string): string {
    return `user ${id} is something something according to my dbdb`;
  }

  changeRole(id: string): string {
    return `this user ${id} is now this role`;
  }
}
