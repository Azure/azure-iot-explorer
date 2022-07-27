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
import { TELEMETRY_ACTIONS } from '../../constants/telemetry';

export const AppVersionMessageBar: React.FC = () => {
    const { t } = useTranslation();

    const [ latestReleaseVersion, setLatestReleaseVersion ] = React.useState(undefined);

    React.useEffect(() => {
        fetchLatestReleaseTagName().then(tagName => {
            setLatestReleaseVersion(tagName);
        });
    },              []);

    const hasNewerRelease = () => {
        try {
            if (!latestReleaseVersion) { return false; }
            const semanticVersion = latestReleaseVersion.replace(/^v/, '');
            return isNewReleaseVersionHigher(semanticVersion, packageJson.version);
        }
        catch {
            return false;
        }
    };

    const onBannerClicked = () => {
        AppInsightsClient.getInstance()?.trackEvent({name: TELEMETRY_ACTIONS.UPDATE_BANNER_CLICKED});
    };

    React.useEffect(() => {
        if (hasNewerRelease()) {
            AppInsightsClient.getInstance()?.trackEvent({name: TELEMETRY_ACTIONS.UPDATE_BANNER_DISPLAYED});
        }
    }, [hasNewerRelease]);  // tslint:disable-line: align

    return hasNewerRelease() ?
       (
            <MessageBar
                className="home-view-message-bar"
                messageBarType={MessageBarType.info}
            >
                {t(ResourceKeys.deviceLists.messageBar.message, {version: latestReleaseVersion})}
                <Link href={latestReleaseUrlPath} target="_blank" onClick={onBannerClicked}>
                    {t(ResourceKeys.deviceLists.messageBar.link)}
                </Link>
            </MessageBar>
        ) : <></>;
};
