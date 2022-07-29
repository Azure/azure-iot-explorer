import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { TELEMETRY_EVENTS } from '../../constants/telemetry';
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
                // TODO: test on domain joined computer
                console.log('INTERNAL: ' + verifyMicrosoftInternalDomain());
                appInsights.trackEvent({name: TELEMETRY_EVENTS.INIT});
                AppInsightsClient.instance = appInsights;
            } catch (e) {
                // tslint:disable-next-line:no-console
                console.log(e);
            }
        }

        return AppInsightsClient.instance;
    }
}

// TODO: move to a better place
const verifyMicrosoftInternalDomain = (): boolean => {
    const msftInternalDomains = ['redmond.corp.microsoft.com', 'northamerica.corp.microsoft.com', 'fareast.corp.microsoft.com', 'ntdev.corp.microsoft.com', 'wingroup.corp.microsoft.com', 'southpacific.corp.microsoft.com', 'wingroup.windeploy.ntdev.microsoft.com', 'ddnet.microsoft.com', 'europe.corp.microsoft.com'];
    const userDnsDomain = process.env.USERDNSDOMAIN;
    if (!userDnsDomain) {
        return false;
    }

    const domain = userDnsDomain.toLowerCase();
    return msftInternalDomains.some(msftDomain => domain === msftDomain);
};
