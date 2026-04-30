/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MessageBar, MessageBarType, MessageBarButton } from '@fluentui/react';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../constants/routes';
import '../../../css/_interfaceNotFoundMessageBar.scss';

export const InterfaceNotFoundMessageBar: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [redirectToModelRepositories, setRedirectToModelRepositories] = React.useState<boolean>(false);

    const onConfigureClick = () => {
        setRedirectToModelRepositories(true);
    };

    if (redirectToModelRepositories) {
        navigate(`/${ROUTE_PARTS.HOME}/${ROUTE_PARTS.MODEL_REPOS}?${ROUTE_PARAMS.NAV_FROM}`);
        return <></>;
    }

    return (
        <div className="message-bar">
            <MessageBar
                messageBarType={MessageBarType.info}
                actions={
                    <MessageBarButton
                        className="configure-button"
                        onClick={onConfigureClick}
                    >
                        {t(ResourceKeys.deviceInterfaces.command.configure)}
                    </MessageBarButton>}
            >
                {t(ResourceKeys.deviceInterfaces.interfaceNotFound)}
            </MessageBar>
        </div>
    );
};
