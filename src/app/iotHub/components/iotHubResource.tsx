/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useParams, useRouteMatch, Redirect, Switch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BreadcrumbRoute } from '../../navigation/components/breadcrumbRoute';
import { useBreadcrumbEntry } from '../../navigation/hooks/useBreadcrumbEntry';
import { IotHubDevices } from './iotHubDevices';
import { ROUTE_PARTS } from '../../constants/routes';
import { ResourceKeys } from '../../../localization/resourceKeys';

export const IotHubResource = () => {
    const { resourceName } = useParams<{resourceName: string}>();
    const { url } = useRouteMatch();
    const { t } = useTranslation();
    useBreadcrumbEntry({ name: resourceName });

    // putting redirects in separate host / resource views with intention to remove from resource once root view ready
    return (
        <Switch>
            <BreadcrumbRoute
                breadcrumb={{ name: t(ResourceKeys.breadcrumb.devices)}}
                path={`${url}/${ROUTE_PARTS.DEVICES}`}
                children={<IotHubDevices/>}
            />
            <Redirect from={url} to={`${url}/devices`} />
        </Switch>
    );
};
