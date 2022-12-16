import "reflect-metadata";
import { EventClient } from "../event.client";
import { EventBus } from "node-redis-eventbus";
export default class RedisClient implements EventClient {
    private eventBus;
    registeredTopics: string[];
    syncMessagesQueue: string[];
    constructor(eventBus: typeof EventBus);
    topics(): string[];
    getByName(name: string): Promise<EventBus>;
    start(topics: Record<string, string[]>): Promise<void>;
    subscribe(main: string, topic: string, callback: (payload: unknown) => Promise<void>): Promise<void>;
    emit(main: string, topic: string, payload: unknown): void;
    emitSync(main: string, topic: string, payload: unknown, timeout?: number): void;
    close(): void;
    private register;
}
