import { ApplicationInsights } from '@microsoft/applicationinsights-web';

export class AppInsightsClient {
    private static instance: ApplicationInsights;

    public static getInstance(): ApplicationInsights {
        if (!AppInsightsClient.instance) {
            const appInsights = new ApplicationInsights({ config: {
                connectionString: 'InstrumentationKey=7ff6989f-09a7-439b-9492-071d8430f64a;IngestionEndpoint=https://westus2-2.in.applicationinsights.azure.com/;LiveEndpoint=https://westus2.livediagnostics.monitor.azure.com/',
                enableAutoRouteTracking: true, // needs to be true to keep track of SPA page views
            } });
            appInsights.loadAppInsights();
            appInsights.trackEvent({name: `INIT`}, {type: 'init'});
            // appInsights.trackPageView();
            AppInsightsClient.instance = appInsights;
        }

        return AppInsightsClient.instance;
    }
}
