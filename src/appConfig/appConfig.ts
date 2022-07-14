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

export enum AppInsightsConnString {
    Dev = 'InstrumentationKey=4e4b375e-0c49-42e3-8a51-20b22ce36181;IngestionEndpoint=https://westus2-2.in.applicationinsights.azure.com/;LiveEndpoint=https://westus2.livediagnostics.monitor.azure.com/',
    Prod = 'InstrumentationKey=7ff6989f-09a7-439b-9492-071d8430f64a;IngestionEndpoint=https://westus2-2.in.applicationinsights.azure.com/;LiveEndpoint=https://westus2.livediagnostics.monitor.azure.com/',
}

export interface AppConfigInterface {
    developmentMode: boolean;
    hostMode: HostMode;
    authMode: AuthMode;
    authServiceSettings?: {
        authority: string;
        client: string;
    };
    azureResourceManagementEndpoint?: string;
    controllerPort: number;
    telemetryConnString: AppInsightsConnString;
}

export const appConfig = config as AppConfigInterface;
