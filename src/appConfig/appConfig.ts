const config = require('./appConfig.ENV.json'); // tslint:disable-line: no-var-requires

export enum AuthMode {
    ImplicitFlow = 'implicitFlow',
    ConnectionString = 'connectionString'
}

export enum HostMode {
    Browser = 'browser',
    Electron = 'electron',
    Debug = 'debug'
}

export interface AppConfigInterface {
    developmentMode: boolean;
    hostMode: HostMode;
    authMode: AuthMode;
    azureResourceManagementEndpoint?: string;
    telemetryConnString: string;
}

export const appConfig = config as AppConfigInterface;
