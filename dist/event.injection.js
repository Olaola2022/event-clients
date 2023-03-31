"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const redis_client_1 = __importDefault(require("./redis/redis.client"));
const redis_mock_1 = __importDefault(require("./redis/redis.mock"));
const eventContainer = tsyringe_1.container;
eventContainer.register("EventClient", {
    useFactory: process.env.NODE_ENV === 'test' ?
        (0, tsyringe_1.instanceCachingFactory)(c => c.resolve(redis_mock_1.default)) :
        (0, tsyringe_1.instanceCachingFactory)(c => c.resolve(redis_client_1.default))
});
exports.default = eventContainer;
