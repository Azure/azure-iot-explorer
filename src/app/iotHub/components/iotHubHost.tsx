/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useParams, Navigate, Routes, Route } from 'react-router-dom';
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
    const { t } = useTranslation();
    useBreadcrumbEntry({ name: getShortHostName(hostName), disableLink: true});

    return (
        <IotHubContext.Provider value={{hostName}}>
            <Routes>
                <Route
                    path={`${ROUTE_PARTS.DEVICES}/*`}
                    element={
                        <BreadcrumbRoute breadcrumb={{ name: t(ResourceKeys.breadcrumb.devices)}}>
                            <IotHubDevices/>
                        </BreadcrumbRoute>
                    }
                />
                <Route path="*" element={<Navigate to={`${ROUTE_PARTS.DEVICES}`} replace />} />
            </Routes>
        </IotHubContext.Provider>
    );
};
