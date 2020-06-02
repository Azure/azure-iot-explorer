/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { useLocalizationContext } from '../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { fetchLatestReleaseTagName, latestReleaseUrlPath } from '../../api/services/githubService';
import * as packageJson from '../../../../package.json';
import { isNewReleaseVersionHigher } from '../utils/appVersionHelper';

export const AppVersionMessageBar: React.FC = () => {
    const { t } = useLocalizationContext();

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

    return hasNewerRelease() ?
        (
            <MessageBar
                className="home-view-message-bar"
                messageBarType={MessageBarType.info}
            >
                {t(ResourceKeys.deviceLists.messageBar.message, {version: latestReleaseVersion})}
                <Link href={latestReleaseUrlPath} target="_blank">
                    {t(ResourceKeys.deviceLists.messageBar.link)}
                </Link>
            </MessageBar>
        ) : <></>;
};
