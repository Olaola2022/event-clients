import "reflect-metadata";
import { inject, injectable, singleton } from "tsyringe";
import { EventClient, EventPayload } from "../event.client";
import { EventBus } from "node-redis-eventbus";
import { v4 as uuid} from "uuid";

@injectable()
@singleton()
export default class RedisClient implements EventClient {
    registeredTopics: string[] = [];

    constructor(
        @inject("EventBus") private eventBus: typeof EventBus,
    ){
        console.log("Redis event initialized");
    }

    topics(): string[] {
        return this.registeredTopics;
    }

    async getByName(name: string): Promise<EventBus> {
        try {
            return this.eventBus.getByName(name);
        } catch {
            return await this.register(name);
        }
    }

    async start(topics: Record<string, string[]>): Promise<void> {
        for (const main in topics) {
            await this.register(main);
        }
    }

    async subscribe(main: string, topic: string, callback: (payload: unknown) => Promise<void>): Promise<void> {
        const bus = await this.getByName(main);
        if (!this.registeredTopics.includes(`${main}.${topic}`))
            this.registeredTopics.push(`${main}.${topic}`);
        await bus.on(topic, async (message: string) => {
            const payload: EventPayload = JSON.parse(message);
            //this.repository.insert(payload.uuid, topic);
            await callback({ body: JSON.parse(payload.body), topic: `${main}.${topic}` });
        }).catch((error) => console.log("Message already processed", error));
    }

    emit(main: string, topic: string, payload: unknown): void {
        const message: EventPayload = {
            uuid: uuid(),
            body: JSON.stringify(payload)
        };
        this.eventBus.getByName(main).emit(topic, message);
        console.log("Event ID", message.uuid, "sended to", `${main}.${topic}`);
    }

    private async register(main: string): Promise<EventBus> {
        try {
            return this.eventBus.getByName(main);
        } catch {
            console.log("Event registered:", main);
            await this.eventBus.create(main, { url: process.env.REDIS });
            return this.eventBus.getByName(main);
        }
    }
}
