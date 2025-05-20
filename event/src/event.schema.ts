import { Schema } from 'mongoose';

export const EventSchema = new Schema(
  {
    id:        { type: String, required: true, unique: true },
    condition: { type: String, required: true },
    name:      { type: String, required: true },
    reward:    { type: String, required: true },
  },
  { collection: 'events' },
);

export const EventRequestSchema = new Schema(
  {
    userid:      { type: String, required: true },
    requestid:   { type: String, required: true, unique: true },
    eventid:     { type: String, required: true },
    token:       { type: String, required: true },
    success:     { type: Boolean },
  },
  { collection: 'reward_requests' },
);