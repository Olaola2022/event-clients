export type EventPayload = {
    uuid: string;
    body: string;
};
export interface EventClient {
    start(topics: Record<string, string[]>): Promise<void>;
    subscribe(main: string, topic: string, callback: (payload: unknown) => Promise<void>): Promise<void>;
    emit(main: string, topic: string, payload: unknown): void;
    emitSync(main: string, topic: string, payload: unknown, timeout?: number): void;
    topics(): string[];
    close(): void;
}
