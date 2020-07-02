import { ApplicationInsights } from '@microsoft/applicationinsights-web';

export class ApplicationClient {
    private static instance: ApplicationInsights;

    public static getInstance(): ApplicationInsights {
        if (!ApplicationClient.instance) {
            const appInsights = new ApplicationInsights({ config: {
                enableAutoRouteTracking: true, // needs to be true to keep track of SPA page views
                instrumentationKey: 'a157c33b-f206-4543-8e1a-4c7184e9419b',
            } });
            appInsights.loadAppInsights();
            appInsights.trackPageView();
            ApplicationClient.instance = appInsights;
        }

        return ApplicationClient.instance;
    }
}
