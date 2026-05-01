/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { TabList, Tab, SelectTabData, SelectTabEvent } from '@fluentui/react-components';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../../constants/routes';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString, getModuleIdentityIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import './moduleIdentityDetailHeader.scss';

export const ModuleIdentityDetailHeader: React.FC = () => {
    const { t } = useTranslation();
    const { search, pathname } = useLocation();
    const navigate = useNavigate();

    const NAV_LINK_ITEMS = [ROUTE_PARTS.MODULE_DETAIL, ROUTE_PARTS.MODULE_TWIN, ROUTE_PARTS.MODULE_METHOD, ROUTE_PARTS.MODULE_EVENTS, ROUTE_PARTS.MODULE_PNP];
    const deviceId = getDeviceIdFromQueryString(search);
    const moduleId = getModuleIdentityIdFromQueryString(search);

    const [selectedKey, setSelectedKey] = React.useState((NAV_LINK_ITEMS.find(item => pathname.indexOf(item) > 0) || ROUTE_PARTS.MODULE_DETAIL).toString());
    const path = pathname.replace(/\/moduleIdentity\/.*/, `/${ROUTE_PARTS.MODULE_IDENTITY}`);

    const handleTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        const key = data.value as string;
        setSelectedKey(key);
        const url = `${path}/${key}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}&${ROUTE_PARAMS.MODULE_ID}=${encodeURIComponent(moduleId)}`;
        navigate(url);
    };

    return (
        <div className="module-pivot">
            <TabList
                aria-label={t(ResourceKeys.digitalTwin.pivot.ariaLabel)}
                selectedValue={selectedKey}
                onTabSelect={handleTabSelect}
            >
                {NAV_LINK_ITEMS.map(nav => (
                    <Tab key={nav} value={nav}>
                        {t((ResourceKeys.breadcrumb as any)[nav])}
                    </Tab>
                ))}
            </TabList>
        </div>
    );
};
