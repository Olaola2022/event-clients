"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
const uuid_1 = require("uuid");
const registeredTopics = new Map();
class EventBus {
    constructor(name) {
        registeredTopics.set(name, []);
    }
    static getByName(name) {
        if (!registeredTopics.get(name) !== undefined) {
            return new EventBus(name);
        }
        else {
            throw Error("Event bus not found");
        }
    }
    static create(name, options) {
        return new EventBus(name);
    }
    on(main, topic, callback) {
        return new Promise((resolve, reject) => {
            const ev = registeredTopics.get(main).find(t => t.topic === topic);
            if (!ev) {
                registeredTopics.get(main).push({ topic, callback });
            }
            else {
                ev.callback = callback;
            }
            resolve();
        });
    }
    emit(main, topic, message) {
        console.info("Event ID", message.uuid, "sended to", `${topic}`);
        const ev = registeredTopics.get(main).find(t => t.topic === topic);
        ev === null || ev === void 0 ? void 0 : ev.callback(message);
    }
    destory() {
        console.info("Event bus destroyed");
    }
}
let RedisMockClient = class RedisMockClient {
    constructor() {
        this.registeredTopics = [];
        this.syncMessagesQueue = [];
        console.info("Redis mock event initialized");
    }
    topics() {
        return this.registeredTopics;
    }
    getByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return EventBus.getByName(name);
            }
            catch (e) {
                return yield this.register(name);
            }
        });
    }
    start(topics) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const main in topics) {
                yield this.register(main);
            }
        });
    }
    subscribe(main, topic, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const bus = yield this.getByName(main);
            if (!this.registeredTopics.includes(`${main}.${topic}`))
                this.registeredTopics.push(`${main}.${topic}`);
            yield bus.on(main, topic, (message) => __awaiter(this, void 0, void 0, function* () {
                const payload = message;
                //this.repository.insert(payload.uuid, topic);
                const result = yield callback({ body: JSON.parse(payload.body), topic: `${main}.${topic}` });
                const index = this.syncMessagesQueue.indexOf(payload.uuid);
                if (index !== -1) {
                    delete this.syncMessagesQueue[index];
                }
            })).catch((error) => console.info("Message already processed", error));
        });
    }
    emit(main, topic, payload) {
        const message = {
            uuid: (0, uuid_1.v4)(),
            body: JSON.stringify(payload)
        };
        this.getByName(main).then(eventBus => eventBus.emit(main, topic, message));
        console.info("Event ID", message.uuid, "sended to", `${main}.${topic}`);
    }
    emitSync(main, topic, payload, timeout = 5000) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = {
                uuid: (0, uuid_1.v4)(),
                body: JSON.stringify(payload)
            };
            this.syncMessagesQueue.push(message.uuid);
            console.info("Event ID", message.uuid, "sended to", `${main}.${topic}`);
            const ev = registeredTopics.get(main).find(t => t.topic === topic);
            yield (ev === null || ev === void 0 ? void 0 : ev.callback(message));
        });
    }
    close() {
        const main = this.topics().map(topic => topic.split(".")[0]);
        main.forEach(key => {
            EventBus.getByName(key).destory();
        });
    }
    register(main) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return EventBus.getByName(main);
            }
            catch (_a) {
                console.info("Event registered:", main);
                EventBus.create(main, {});
                return EventBus.getByName(main);
            }
        });
    }
};
RedisMockClient = __decorate([
    (0, tsyringe_1.injectable)(),
    (0, tsyringe_1.singleton)(),
    __metadata("design:paramtypes", [])
], RedisMockClient);
exports.default = RedisMockClient;
