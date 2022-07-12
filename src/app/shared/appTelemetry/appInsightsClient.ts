import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { appConfig, HostMode } from '../../../appConfig/appConfig';
export class AppInsightsClient {
    private static instance: ApplicationInsights;

    public static getInstance(): ApplicationInsights {
        if (!AppInsightsClient.instance) {
            const devConn = 'InstrumentationKey=4e4b375e-0c49-42e3-8a51-20b22ce36181;IngestionEndpoint=https://westus2-2.in.applicationinsights.azure.com/;LiveEndpoint=https://westus2.livediagnostics.monitor.azure.com/';
            const prodConn = 'InstrumentationKey=7ff6989f-09a7-439b-9492-071d8430f64a;IngestionEndpoint=https://westus2-2.in.applicationinsights.azure.com/;LiveEndpoint=https://westus2.livediagnostics.monitor.azure.com/';
            const appInsights = new ApplicationInsights({ config: {
                accountId: appConfig.hostMode === HostMode.Debug ? 'dev' : undefined,
                autoTrackPageVisitTime: true,
                connectionString: appConfig.hostMode === HostMode.Debug ? devConn : prodConn,
            } });
            appInsights.loadAppInsights();
            appInsights.trackEvent({name: `INIT`}, {type: 'init'});
            AppInsightsClient.instance = appInsights;
        }

        return AppInsightsClient.instance;
    }
}
