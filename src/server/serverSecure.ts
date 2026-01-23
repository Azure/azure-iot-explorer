/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as https from 'https';
import * as crypto from 'crypto';
import * as express from 'express';
import * as WebSocket from 'ws';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import { generateSelfSignedCert, TlsCertificates } from './tlsHelper';

export const SERVER_ERROR = 500;
export const SUCCESS = 200;
const UNAUTHORIZED = 401;
const TOO_MANY_REQUESTS = 429;

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100;

export class SecureServerBase {
    private readonly port: number;
    private authToken: string;
    private certificates: TlsCertificates;
    private rateLimitMap: Map<string, number[]> = new Map();
    private wss: WebSocket.Server | null = null;
    private ws: WebSocket | null = null;

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

    /**
     * Initialize the secure HTTPS server
     */
    public init(
        registerRoutes: (app: express.Express) => void,
        onWebSocketConnection?: (ws: WebSocket) => void
    ): void {
        const app = express();

        // Security middleware
        app.use(helmet({
            contentSecurityPolicy: false,
            crossOriginEmbedderPolicy: false
        }));

        // Body parsing
        app.use(bodyParser.json({ limit: '10mb' }));

        // CORS configuration for HTTPS
        app.use((req, res, next) => {
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
        app.get('/health', (_, res) => {
            res.json({ status: 'ok', secure: true });
        });

        // Register application routes
        registerRoutes(app);

        // Create HTTPS server
        const server = https.createServer(
            {
                cert: this.certificates.cert,
                key: this.certificates.key,
                // Modern TLS configuration
                minVersion: 'TLSv1.2'
            },
            app
        );

        // Initialize secure WebSocket server
        this.wss = new WebSocket.Server({ server });

        this.wss.on('connection', (wsConnection, req) => {
            // Validate auth token from query string for WebSocket
            const url = new URL(req.url || '', `https://localhost:${this.port}`);
            const token = url.searchParams.get('token');

            if (token !== this.authToken) {
                wsConnection.close(1008, 'Unauthorized');
                return;
            }

            this.ws = wsConnection;

            if (onWebSocketConnection) {
                onWebSocketConnection(wsConnection);
            }
        });

        // Start server
        server.listen(this.port, '127.0.0.1', () => {
            // tslint:disable-next-line: no-console
            console.log(`Secure server running on https://127.0.0.1:${this.port}`);
        }).on('error', (err: NodeJS.ErrnoException) => {
            if (err.code === 'EADDRINUSE') {
                throw new Error(
                    `Failed to start secure server on port ${this.port} as it is in use.\n` +
                    `Configure a custom port via AZURE_IOT_EXPLORER_PORT environment variable.`
                );
            }
            throw err;
        });
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
}
