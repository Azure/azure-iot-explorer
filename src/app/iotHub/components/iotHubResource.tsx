/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useParams, Navigate, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BreadcrumbRoute } from '../../navigation/components/breadcrumbRoute';
import { useBreadcrumbEntry } from '../../navigation/hooks/useBreadcrumbEntry';
import { IotHubDevices } from './iotHubDevices';
import { ROUTE_PARTS } from '../../constants/routes';
import { ResourceKeys } from '../../../localization/resourceKeys';

export const IotHubResource = () => {
    const { resourceName } = useParams<{resourceName: string}>();
    const { t } = useTranslation();
    useBreadcrumbEntry({ name: resourceName });

    return (
        <Routes>
            <Route
                path={`${ROUTE_PARTS.DEVICES}/*`}
                element={
                    <BreadcrumbRoute breadcrumb={{ name: t(ResourceKeys.breadcrumb.devices)}}>
                        <IotHubDevices/>
                    </BreadcrumbRoute>
                }
            />
            <Route path="*" element={<Navigate to="devices" replace />} />
        </Routes>
    );
};
