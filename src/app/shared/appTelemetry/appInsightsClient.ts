import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { appConfig, AppInsightsConnString } from '../../../appConfig/appConfig';
export class AppInsightsClient {
    private static instance: ApplicationInsights;

    public static getInstance(): ApplicationInsights {
        if (!AppInsightsClient.instance) {
            const appInsights = new ApplicationInsights({ config: {
                autoTrackPageVisitTime: true,
                connectionString: appConfig.telemetryConnString ? appConfig.telemetryConnString : AppInsightsConnString.Prod,
            } });
            appInsights.loadAppInsights();
            appInsights.trackEvent({name: `INIT`}, {type: 'init'});
            AppInsightsClient.instance = appInsights;
        }

        return AppInsightsClient.instance;
    }
}
