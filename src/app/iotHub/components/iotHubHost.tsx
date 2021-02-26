/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useParams, useRouteMatch, Redirect, Switch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useBreadcrumbEntry } from '../../navigation/hooks/useBreadcrumbEntry';
import { IotHubDevices } from './iotHubDevices';
import { ROUTE_PARTS } from '../../constants/routes';
import { BreadcrumbRoute } from '../../navigation/components/breadcrumbRoute';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { getShortHostName } from '../utils';
import { IotHubContext } from '../hooks/useIotHubContext';

export const IotHubHost = () => {
    const { hostName } = useParams<{hostName: string}>();
    const { url } = useRouteMatch();
    const { t } = useTranslation();
    useBreadcrumbEntry({ name: getShortHostName(hostName), disableLink: true});

    return (
        <IotHubContext.Provider value={{hostName}}>
            <Switch>
                <BreadcrumbRoute
                    breadcrumb={{ name: t(ResourceKeys.breadcrumb.devices)}}
                    path={`${url}/${ROUTE_PARTS.DEVICES}`}
                    children={<IotHubDevices/>}
                />
                <Redirect from={url} to={`${url}/${ROUTE_PARTS.DEVICES}`} />
            </Switch>
        </IotHubContext.Provider>
    );
};
