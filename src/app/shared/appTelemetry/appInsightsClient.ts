import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { appConfig } from '../../../appConfig/appConfig';
export class AppInsightsClient {
    private static instance: ApplicationInsights;

    public static getInstance(): ApplicationInsights {
        if (!AppInsightsClient.instance) {
            const appInsights = new ApplicationInsights({ config: {
                autoTrackPageVisitTime: true,
                connectionString: appConfig.telemetryConnString
            } });
            try {
                appInsights.loadAppInsights();
                appInsights.trackEvent({name: `INIT`}, {type: 'init'});
            } catch (e) {
                // tslint:disable-next-line:no-console
                console.log(e);
                AppInsightsClient.instance = appInsights;
            }
        }

        return AppInsightsClient.instance;
    }
}
