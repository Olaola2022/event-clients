"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscriber = exports.Subscribe = exports.RedisEventClient = exports.RedisEventBus = exports.eventContainer = void 0;
require("reflect-metadata");
const redis_client_1 = __importDefault(require("./redis/redis.client"));
const node_redis_eventbus_1 = require("node-redis-eventbus");
const subscribe_decorator_1 = require("./subscriber/subscribe.decorator");
const subscriber_decorator_1 = require("./subscriber/subscriber.decorator");
const event_injection_1 = __importDefault(require("./event.injection"));
exports.eventContainer = event_injection_1.default;
exports.RedisEventBus = node_redis_eventbus_1.EventBus;
exports.RedisEventClient = redis_client_1.default;
exports.Subscribe = subscribe_decorator_1.Subscribe;
exports.Subscriber = subscriber_decorator_1.Subscriber;
