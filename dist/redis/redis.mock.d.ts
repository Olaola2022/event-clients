import "reflect-metadata";
import { EventClient, EventPayload } from "../event.client";
declare class EventBus {
    constructor(name: string);
    static getByName(name: string): EventBus;
    static create(name: string, options: unknown): EventBus;
    on(main: string, topic: string, callback: (message: EventPayload) => Promise<void>): Promise<void>;
    emit(main: string, topic: string, message: EventPayload): void;
    destory(): void;
}
export default class RedisMockClient implements EventClient {
    registeredTopics: string[];
    syncMessagesQueue: string[];
    events: EventBus;
    constructor();
    topics(): string[];
    getByName(name: string): Promise<EventBus>;
    start(topics: Record<string, string[]>): Promise<void>;
    subscribe(main: string, topic: string, callback: (payload: unknown) => Promise<void>): Promise<void>;
    emit(main: string, topic: string, payload: unknown): void;
    emitSync(main: string, topic: string, payload: unknown, timeout?: number): Promise<void>;
    close(): void;
    private register;
}
export {};
