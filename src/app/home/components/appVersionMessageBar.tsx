/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { MessageBar, MessageBarType, Link } from '@fluentui/react';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { fetchLatestReleaseTagName, latestReleaseUrlPath } from '../../api/services/githubService';
import * as packageJson from '../../../../package.json';
import { isNewReleaseVersionHigher } from '../utils/appVersionHelper';
import { AppInsightsClient } from '../../shared/appTelemetry/appInsightsClient';
import { TELEMETRY_EVENTS } from '../../constants/telemetry';

export const AppVersionMessageBar: React.FC = () => {
    const { t } = useTranslation();

    const [ latestReleaseVersion, setLatestReleaseVersion ] = React.useState(undefined);
    const [ hasNewerRelease, setHasNewerRelease ] = React.useState(false);

    React.useEffect(() => {
        fetchLatestReleaseTagName().then(tagName => {
            setLatestReleaseVersion(tagName);
        });
    },              []);

    React.useEffect(() => {
        try {
            if (!latestReleaseVersion) { setHasNewerRelease(false); }
            const semanticVersion = latestReleaseVersion.replace(/^v/, '');
            setHasNewerRelease(isNewReleaseVersionHigher(semanticVersion, packageJson.version));
        }
        catch {
            setHasNewerRelease(false);
        }
    }, [latestReleaseVersion]); // tslint:disable-line: align

    React.useEffect(() => {
        if (hasNewerRelease) {
            AppInsightsClient.getInstance()?.trackEvent({name: TELEMETRY_EVENTS.UPDATE_BANNER}, {displayed: true});
        } else {
            AppInsightsClient.getInstance()?.trackEvent({name: TELEMETRY_EVENTS.UPDATE_BANNER}, {displayed: false});
        }
    }, [hasNewerRelease]);  // tslint:disable-line: align

    return hasNewerRelease ?
       (
            <MessageBar
                messageBarType={MessageBarType.info}
            >
                {t(ResourceKeys.deviceLists.messageBar.message, {version: latestReleaseVersion})}
                <Link href={latestReleaseUrlPath} target="_blank">
                    {t(ResourceKeys.deviceLists.messageBar.link)}
                </Link>
            </MessageBar>
        ) : <></>;
};
