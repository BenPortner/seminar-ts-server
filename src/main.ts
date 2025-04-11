import http from 'http';
import https from 'https';
import express from 'express';
import fs from 'fs';
import { instrument } from '@socket.io/admin-ui';

import { SeminarServer } from './server';
import { AdapterListeners } from './handlers/adapterListeners';
import {
    port,
    origin,
    privateKeyPath,
    certificatePath,
    adminUIAuthOptions,
} from './utils/config';
import path from 'path';

// express app setup
const app = express();
app.use('/', express.static(path.join(__dirname, '../public/hashGenerator')));
app.use(
    '/admin',
    express.static(path.join(__dirname, '../public/admin'))
);

// http(s) server setup
let server: http.Server | https.Server;
if (privateKeyPath === undefined || certificatePath === undefined) {
    server = http.createServer(app);
} else {
    const privateKey = fs.readFileSync(privateKeyPath);
    const certificate = fs.readFileSync(certificatePath);
    const credentials = { key: privateKey, cert: certificate };
    server = https.createServer(credentials, app);
}

// socket.io setup
const io = new SeminarServer(server, {
    cors: {
        credentials: true,
        origin: origin,
    },
});
AdapterListeners.initialize(io.of('/').adapter);

// add instruments for socket.io admin UI
instrument(io, { auth: adminUIAuthOptions });

// start server
server.listen(port, () => console.log(`Server running on port ${port}`));

// save this for global reference
SeminarServer.io = io;
