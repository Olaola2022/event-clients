"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscribe = void 0;
const subscriptionKey = require("./key");
function Subscribe(topic) {
    return function (target, propertyKey) {
        const subscriptions = Reflect.getMetadata(subscriptionKey, target) || new Set();
        if (typeof topic == 'string') {
            subscriptions.add({ topic, handler: propertyKey });
        }
        else {
            topic.forEach(t => subscriptions.add({ topic: t, handler: propertyKey }));
        }
        Reflect.defineMetadata(subscriptionKey, subscriptions, target);
    };
}
exports.Subscribe = Subscribe;
