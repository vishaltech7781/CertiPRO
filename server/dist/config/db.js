"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
exports.disconnectDB = disconnectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const env_js_1 = require("./env.js");
async function connectDB() {
    try {
        mongoose_1.default.set('strictQuery', true);
        await mongoose_1.default.connect(env_js_1.env.MONGODB_URI);
        console.log(`[Database] MongoDB connected successfully to ${mongoose_1.default.connection.host}/${mongoose_1.default.connection.name}`);
    }
    catch (error) {
        console.error('[Database] MongoDB connection error:', error);
        process.exit(1);
    }
}
async function disconnectDB() {
    try {
        await mongoose_1.default.disconnect();
        console.log('[Database] MongoDB disconnected');
    }
    catch (error) {
        console.error('[Database] Disconnect error:', error);
    }
}
