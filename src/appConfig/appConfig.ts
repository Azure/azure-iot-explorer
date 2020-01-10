const config = require('./appConfig.ENV.json'); // tslint:disable-line: no-var-requires

export enum AuthMode {
    ImplicitFlow = 'implicitFlow',
    ConnectionString = 'connectionString'
}

export enum HostMode {
    Browser = 'browser',
    Electron = 'electron'
}

export interface AppConfigInterface {
    developmentMode: boolean;
    hostMode: HostMode;
    authMode: AuthMode;
}

export const appConfig = config as AppConfigInterface;
