/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Redirect } from 'react-router-dom';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { MessageBarButton } from 'office-ui-fabric-react/lib/Button';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import '../../../../css/_interfaceNotFoundMessageBar.scss';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../../constants/routes';

export const InterfaceNotFoundMessageBar: React.FC = () => {
    const [redirectToModelRepositories, setRedirectToModelRepositories] = React.useState<boolean>(false);

    const onConfigureClick = () => {
        setRedirectToModelRepositories(true);
    };

    if (redirectToModelRepositories) {
        return <Redirect to={`/${ROUTE_PARTS.HOME}/${ROUTE_PARTS.MODEL_REPOS}?${ROUTE_PARAMS.NAV_FROM}`} />;
    }

    return (
        <LocalizationContextConsumer>
            {(context: LocalizationContextInterface) => (
                <div className="message-bar">
                    <MessageBar
                        messageBarType={MessageBarType.error}
                        actions={
                            <MessageBarButton
                                className="configure-button"
                                onClick={onConfigureClick}
                            >
                                {context.t(ResourceKeys.deviceInterfaces.command.configure)}
                            </MessageBarButton>}
                    >
                        {context.t(ResourceKeys.deviceInterfaces.interfaceNotFound)}
                    </MessageBar>
                </div>
            )}
        </LocalizationContextConsumer>
    );
};
