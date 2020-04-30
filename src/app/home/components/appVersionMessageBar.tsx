/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { fetchLatestReleaseTagName, latestReleaseUrlPath } from '../../api/services/githubService';
import * as packageJson from '../../../../package.json';
import { isNewReleaseVersionHigher } from '../utils/appVersionHelper';

interface AppVersionMessageBarState {
    latestReleaseVersion?: string;
}

export default class AppVersionMessageBar extends React.Component<{}, AppVersionMessageBarState> {

    public render() {
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    this.renderMessageBar(context)
                )}
            </LocalizationContextConsumer>
        );
    }

    public componentDidMount() {
        fetchLatestReleaseTagName().then(tagName => {
            this.setState({latestReleaseVersion: tagName});
        });
    }

    private readonly hasNewerRelease = () => {
        try {
            if (!this.state || !this.state.latestReleaseVersion) { return false; }
            const semanticVersion = this.state.latestReleaseVersion.replace(/^v/, '');
            return isNewReleaseVersionHigher(semanticVersion, packageJson.version);
        }
        catch {
            return false;
        }
    }

    private readonly renderMessageBar = (context: LocalizationContextInterface) => {
        return this.hasNewerRelease() ?
        (
            <MessageBar
                messageBarType={MessageBarType.info}
            >
                {context.t(ResourceKeys.deviceLists.messageBar.message, {version: this.state.latestReleaseVersion})}
                <Link href={latestReleaseUrlPath} target="_blank">
                {context.t(ResourceKeys.deviceLists.messageBar.link)}
                </Link>
            </MessageBar>
        ) : <></>;
    }
}
