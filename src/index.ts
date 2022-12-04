import RedisClient from "./redis/redis.client";
import { EventClient as eventClient } from "./event.client";

export type EventClient = eventClient;

export const RedisEventClient = RedisClient;
