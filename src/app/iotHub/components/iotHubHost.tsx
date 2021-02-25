/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useParams, useRouteMatch, Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useBreadcrumbEntry } from '../../navigation/hooks/useBreadcrumbEntry';
import { IotHubDevices } from './iotHubDevices';
import { ROUTE_PARTS } from '../../constants/routes';
import { BreadcrumbRoute } from '../../navigation/components/breadcrumbRoute';
import { ResourceKeys } from '../../../localization/resourceKeys';

export const getShortHostName = (name: string) => {
    return name && name.replace(/\..*/, '');
};

export const IotHubHost = () => {
    const { hostName } = useParams<{hostName: string}>();
    const { url } = useRouteMatch();
    const { t } = useTranslation();

    useBreadcrumbEntry({ name: getShortHostName(hostName), disableLink: true});
    // putting redirects in separate host / resource views with intention to remove from resource once root view ready

    return (
        <>
            <Redirect from={url} to={`${url}/${ROUTE_PARTS.DEVICES}`} />
            <BreadcrumbRoute
                breadcrumb={{ name: t(ResourceKeys.breadcrumb.devices)}}
                path={`${url}/${ROUTE_PARTS.DEVICES}`}
                children={<IotHubDevices/>}
            />
        </>
    );
};
