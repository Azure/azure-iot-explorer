/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
// this file is the legacy controller for local development, until we move server side code to use electron's IPC pattern and enable electron hot reloading
import * as fs from 'fs';
import * as https from 'https';
import * as crypto from 'crypto';
import * as WebSocket from 'ws';
import express = require('express');
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import fetch from 'node-fetch';
import * as he from 'he';
import { EventHubConsumerClient, Subscription, ReceivedEventData, earliestEventPosition } from '@azure/event-hubs';
import { generateDataPlaneRequestBody, generateDataPlaneResponse } from './dataPlaneHelper';
import { convertIotHubToEventHubsConnectionString } from './eventHubHelper';
import { checkPath, fetchDirectories, findMatchingFile, readFileFromLocal, SAFE_ROOT } from './utils';
import { generateSelfSignedCert, TlsCertificates } from './tlsHelper';

export const SERVER_ERROR = 500;
export const SUCCESS = 200;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const NO_CONTENT_SUCCESS = 204;
const UNAUTHORIZED = 401;
const TOO_MANY_REQUESTS = 429;

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100;

interface Message {
    body: any; // tslint:disable-line:no-any
    enqueuedTime: string;
    sequenceNumber: number;
    properties?: any; // tslint:disable-line:no-any
    systemProperties?: {[key: string]: string};
}

export class ServerBase {
    private readonly port: number;
    private authToken: string;
    private certificates: TlsCertificates;
    private rateLimitMap: Map<string, number[]> = new Map();
    private wss: WebSocket.Server | null = null;
    private ws: WebSocket | null = null;
    private messages: Message[] = [];
    private timerId: NodeJS.Timer | null = null;
    private client: EventHubConsumerClient | null = null;
    private subscription: Subscription | null = null;

    constructor(port: number) {
        this.port = port;
        // Generate cryptographically secure random token
        this.authToken = crypto.randomBytes(32).toString('hex');
        // Generate TLS certificates
        this.certificates = generateSelfSignedCert();
    }

    /**
     * Returns the authentication token to be shared with the renderer process via IPC
     */
    public getAuthToken(): string {
        return this.authToken;
    }

    /**
     * Returns the server certificate for the renderer to trust
     */
    public getCertificate(): string {
        return this.certificates.cert;
    }

    /**
     * Returns the certificate fingerprint for verification
     */
    public getCertificateFingerprint(): string {
        return this.certificates.fingerprint;
    }

    /**
     * Authentication middleware - validates the auth token header
     */
    private authMiddleware = (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        const token = req.headers['x-auth-token'];

        if (!token || token !== this.authToken) {
            return res.status(UNAUTHORIZED).json({
                error: 'Unauthorized',
                message: 'Invalid or missing authentication token'
            });
        }

        next();
    }

    /**
     * Rate limiting middleware - prevents abuse
     */
    private rateLimitMiddleware = (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        const now = Date.now();
        const clientKey = req.ip || 'unknown';

        // Get existing timestamps for this client
        const timestamps = this.rateLimitMap.get(clientKey) || [];

        // Filter to only recent requests within the window
        const recentTimestamps = timestamps.filter(
            t => now - t < RATE_LIMIT_WINDOW_MS
        );

        if (recentTimestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
            return res.status(TOO_MANY_REQUESTS).json({
                error: 'Too Many Requests',
                message: 'Rate limit exceeded. Please try again later.',
                retryAfter: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)
            });
        }

        // Add current timestamp and update map
        recentTimestamps.push(now);
        this.rateLimitMap.set(clientKey, recentTimestamps);

        // Clean up old entries periodically (1% chance per request)
        if (Math.random() < 0.01) {
            this.cleanupRateLimitMap();
        }

        next();
    }

    /**
     * Clean up old rate limit entries to prevent memory leaks
     */
    private cleanupRateLimitMap(): void {
        const now = Date.now();
        const keys = Array.from(this.rateLimitMap.keys());
        for (const key of keys) {
            const timestamps = this.rateLimitMap.get(key) || [];
            const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
            if (recent.length === 0) {
                this.rateLimitMap.delete(key);
            } else {
                this.rateLimitMap.set(key, recent);
            }
        }
    }

    public init() {
        const app = express();

        // Security headers via helmet
        app.use(helmet({
            contentSecurityPolicy: false,
            crossOriginEmbedderPolicy: false
        }));

        // Body parsing
        app.use(bodyParser.json({ limit: '10mb' }));

        // CORS configuration for HTTPS
        app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const allowedOrigins = [
                'https://127.0.0.1:3000',
                'https://localhost:3000',
                'http://127.0.0.1:3000',  // Allow HTTP during transition
                'http://localhost:3000'
            ];
            const origin = req.headers.origin;

            if (origin && allowedOrigins.includes(origin)) {
                res.header('Access-Control-Allow-Origin', origin);
            }

            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, x-auth-token');
            res.header('Access-Control-Allow-Credentials', 'true');

            if (req.method === 'OPTIONS') {
                return res.status(200).end();
            }

            next();
        });

        // Apply rate limiting to all routes
        app.use(this.rateLimitMiddleware);

        // Apply authentication to all API routes
        app.use('/api', this.authMiddleware);

        // Health check endpoint (no auth required for basic health check)
        app.get('/health', (_: express.Request, res: express.Response) => {
            res.json({ status: 'ok', secure: true });
        });

        // Register default routes
        this.registerDefaultRoutes(app);

        // Create HTTPS server
        const server = https.createServer(
            {
                cert: this.certificates.cert,
                key: this.certificates.key,
                minVersion: 'TLSv1.2'
            },
            app
        );

        // Start server
        server.listen(this.port, '127.0.0.1', () => {
            // tslint:disable-next-line: no-console
            console.log(`Secure server running on https://127.0.0.1:${this.port}`);
        }).on('error', (err: NodeJS.ErrnoException) => {
            if (err.code === 'EADDRINUSE') {
                throw new Error(
                    `Failed to start the app on port ${this.port} as it is in use.\n` +
                    `You can still view static pages, but requests cannot be made to the services if the port is still occupied.\n` +
                    `To get around with the issue, configure a custom port by setting the system environment variable 'AZURE_IOT_EXPLORER_PORT' to an available port number.\n` +
                    `To learn more, please visit https://github.com/Azure/azure-iot-explorer/wiki/FAQ`
                );
            }
            throw err;
        });

        // Initialize secure WebSocket with token authentication
        this.wss = new WebSocket.Server({ server });
        this.wss.on('connection', (wsConnection: WebSocket, req) => {
            console.log("got a web socket rquest");
            // Validate auth token from query string for WebSocket
            const url = new URL(req.url || '', `https://localhost:${this.port}`);
            const token = url.searchParams.get('token');

            if (token !== this.authToken) {
                console.log("token not valid");
                wsConnection.close(1008, 'Unauthorized');
                return;
            }

            this.ws = wsConnection;
        });
    }

    /**
     * Register default API routes
     */
    private registerDefaultRoutes(app: express.Express): void {
        app.post('/api/DataPlane', this.handleDataPlanePostRequest.bind(this));
        app.post('/api/EventHub/monitor', this.handleEventHubMonitorPostRequest.bind(this));
        app.post('/api/EventHub/stop', this.handleEventHubStopPostRequest.bind(this));
        app.get('/api/ReadFile/:path/:file', this.handleReadFileRequest.bind(this));
        app.get('/api/ReadFileNaive/:path/:file', this.handleReadFileNaiveRequest.bind(this));
        app.get('/api/Directories/:path', this.handleGetDirectoriesRequest.bind(this));
    }

    /**
     * Send message to connected WebSocket client
     */
    public sendWebSocketMessage(message: string): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(message);
        }
    }

    /**
     * Get current WebSocket connection
     */
    public getWebSocket(): WebSocket | null {
        return this.ws;
    }

    // Route Handlers - converted to instance methods

    private handleReadFileRequest(req: express.Request, res: express.Response) {
        try {
            const filePath = req.params.path;
            const expectedFileName = req.params.file;
            if (!filePath || !expectedFileName) {
                res.status(BAD_REQUEST).send();
            }
            else {
                const resolvedPath = checkPath(filePath);
                const fileNames = fs.readdirSync(resolvedPath);
                try {
                    const foundContent = findMatchingFile(resolvedPath, fileNames, expectedFileName);
                    if (foundContent) {
                        res.status(SUCCESS).send(foundContent);
                    }
                    else {
                        res.status(NO_CONTENT_SUCCESS).send();
                    }
                }
                catch (error) {
                    res.status(NOT_FOUND).send('Not able to find any matching file.');
                }
            }
        }
        catch (error) {
            res.status(SERVER_ERROR).send(error?.message);
        }
    }

    private handleReadFileNaiveRequest(req: express.Request, res: express.Response) {
        try {
            const filePath = req.params.path;
            const expectedFileName = req.params.file;
            if (!filePath || !expectedFileName) {
                res.status(BAD_REQUEST).send();
            }
            else {
                const data = readFileFromLocal(filePath, expectedFileName);
                JSON.parse(data); // try parse the data to validate json format
                res.status(SUCCESS).send(data);
            }
        }
        catch (error) {
            res.status(SERVER_ERROR).send(error?.message);
        }
    }

    private handleGetDirectoriesRequest(req: express.Request, res: express.Response) {
        try {
            const dir = req.params.path;
            if (dir === '$DEFAULT') {
                res.status(SUCCESS).send([SAFE_ROOT]);
            }
            else {
                fetchDirectories(dir, res);
            }
        }
        catch (error) {
            res.status(SERVER_ERROR).send(error?.message);
        }
    }

    private async handleDataPlanePostRequest(req: express.Request, res: express.Response) {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                res.status(BAD_REQUEST).send('Request body is empty or not parsed');
            }
            else {
                const dataPlaneRequest = generateDataPlaneRequestBody(req);
                const response = fetch(dataPlaneRequest.url, dataPlaneRequest.request);
                await generateDataPlaneResponse(await response, res);
            }
        }
        catch (error) {
            res.status(SERVER_ERROR).send(error?.message);
        }
    }

    private handleEventHubMonitorPostRequest(req: express.Request, res: express.Response) {
        try {
            if (!req.body) {
                res.status(BAD_REQUEST).send();
                return;
            }
            this.initializeEventHubClient(req.body).then(() => {
                res.status(SUCCESS).send([]);
            });
        } catch (error) {
            res.status(SERVER_ERROR).send(he.encode(error.toString()));
        }
    }

    private handleEventHubStopPostRequest(req: express.Request, res: express.Response) {
        try {
            if (!req.body) {
                res.status(BAD_REQUEST).send();
                return;
            }

            this.stopClient().then(() => {
                res.status(SUCCESS).send();
            });
        } catch (error) {
            res.status(SERVER_ERROR).send(he.encode(error.toString()));
        }
    }

    private async initializeEventHubClient(params: any) {
        if (params.customEventHubConnectionString) {
            this.client = new EventHubConsumerClient(params.consumerGroup, params.customEventHubConnectionString);
        }
        else {
            this.client = new EventHubConsumerClient(params.consumerGroup, await convertIotHubToEventHubsConnectionString(params.hubConnectionString));
        }
        this.subscription = this.client.subscribe(
            {
                processEvents: async (events) => {
                    this.handleMessages(events, params);
                },
                processError: async (err) => {
                    console.log(err);
                }
            },
            {startPosition: earliestEventPosition}
        );

        this.timerId = setInterval(() => {
            if (this.ws && this.ws.readyState === 1) {
                this.ws.send(JSON.stringify(this.messages));
            }
            this.messages = [];
        }, 800); // send messages to client in a 0.8 sec interval
    }

    private handleMessages(events: ReceivedEventData[], params: any) {
        const IOTHUB_CONNECTION_DEVICE_ID = 'iothub-connection-device-id';
        const IOTHUB_CONNECTION_MODULE_ID = 'iothub-connection-module-id';

        events.forEach(event => {
            if (event?.systemProperties?.[IOTHUB_CONNECTION_DEVICE_ID] === params.deviceId) {
                if (!params.moduleId || event?.systemProperties?.[IOTHUB_CONNECTION_MODULE_ID] === params.moduleId) {
                    const message: Message = {
                        body: event.body,
                        enqueuedTime: event.enqueuedTimeUtc.toString(),
                        properties: event.properties,
                        sequenceNumber: event.sequenceNumber
                    };
                    message.systemProperties = event.systemProperties;
                    if (this.messages.find(item => item.sequenceNumber === message.sequenceNumber))
                        return; // do not push message if the same sequence already exist
                    this.messages.push(message);
                }
            }
        });
    }

    private async stopClient() {
        console.log('stop client');
        if (this.messages.length >= 1) {
            // send left over messages if any
            if (this.ws) {
                this.ws.send(JSON.stringify(this.messages));
            }
            this.messages = [];
        }
        if (this.timerId) {
            clearInterval(this.timerId);
        }
        await this.subscription?.close();
        await this.client?.close();
    }
}


