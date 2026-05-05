/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MessageBar, MessageBarBody, MessageBarActions, Button } from '@fluentui/react-components';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../constants/routes';
import '../../../css/_interfaceNotFoundMessageBar.scss';

export const InterfaceNotFoundMessageBar: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const onConfigureClick = () => {
        navigate(`/${ROUTE_PARTS.HOME}/${ROUTE_PARTS.MODEL_REPOS}?${ROUTE_PARAMS.NAV_FROM}`);
    };

    return (
        <div className="message-bar">
            <MessageBar
                intent="info"
            >
                <MessageBarBody>
                    {t(ResourceKeys.deviceInterfaces.interfaceNotFound)}
                </MessageBarBody>
                <MessageBarActions>
                    <Button
                        className="configure-button"
                        onClick={onConfigureClick}
                    >
                        {t(ResourceKeys.deviceInterfaces.command.configure)}
                    </Button>
                </MessageBarActions>
            </MessageBar>
        </div>
    );
};
