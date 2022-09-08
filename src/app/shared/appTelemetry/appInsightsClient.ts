import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { TELEMETRY_EVENTS, TELEMETRY_USER_ACTIONS } from '../../../app/constants/telemetry';
import { appConfig } from '../../../appConfig/appConfig';
import { isMicrosoftInternalDomain } from '../utils/utils';

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
                appInsights.trackEvent({name: TELEMETRY_EVENTS.INTERNAL_USER}, {isInternal: isMicrosoftInternalDomain()});
                AppInsightsClient.instance = appInsights;
            } catch (e) {
                // tslint:disable-next-line:no-console
                console.log(e);
            }
        }

        return AppInsightsClient.instance;
    }

    public static trackUserAction(userAction: TELEMETRY_USER_ACTIONS) {
        AppInsightsClient.getInstance()?.trackEvent({name: TELEMETRY_EVENTS.USER_ACTION}, {action: userAction});
    }
}
