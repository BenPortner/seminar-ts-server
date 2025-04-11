"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const admin_ui_1 = require("@socket.io/admin-ui");
const server_1 = require("./server");
const adapterListeners_1 = require("./handlers/adapterListeners");
const config_1 = require("./utils/config");
const path_1 = __importDefault(require("path"));
// express app setup
const app = (0, express_1.default)();
app.use('/', express_1.default.static(path_1.default.join(__dirname, '../public/hashGenerator')));
app.use('/admin', express_1.default.static(path_1.default.join(__dirname, '../public/admin')));
// http(s) server setup
let server;
if (config_1.privateKeyPath === undefined || config_1.certificatePath === undefined) {
    server = http_1.default.createServer(app);
}
else {
    const privateKey = fs_1.default.readFileSync(config_1.privateKeyPath);
    const certificate = fs_1.default.readFileSync(config_1.certificatePath);
    const credentials = { key: privateKey, cert: certificate };
    server = https_1.default.createServer(credentials, app);
}
// socket.io setup
const io = new server_1.SeminarServer(server, {
    cors: {
        credentials: true,
        origin: config_1.origin,
    },
});
adapterListeners_1.AdapterListeners.initialize(io.of('/').adapter);
// add instruments for socket.io admin UI
(0, admin_ui_1.instrument)(io, { auth: config_1.adminUIAuthOptions });
// start server
server.listen(config_1.port, () => console.log(`Server running on port ${config_1.port}`));
// save this for global reference
server_1.SeminarServer.io = io;
//# sourceMappingURL=main.js.map