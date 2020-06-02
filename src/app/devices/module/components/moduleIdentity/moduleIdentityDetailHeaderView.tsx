/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import { useLocalizationContext } from '../../../../shared/contexts/localizationContext';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../../constants/routes';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString, getModuleIdentityIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import '../../../../css/_pivotHeader.scss';

export const ModuleIdentityDetailHeaderView: React.FC = () => {
    const { t } = useLocalizationContext();
    const { search, pathname } = useLocation();

    const NAV_LINK_ITEMS = [ROUTE_PARTS.MODULE_DETAIL, ROUTE_PARTS.MODULE_TWIN];
    const deviceId = getDeviceIdFromQueryString(search);
    const moduleId = getModuleIdentityIdFromQueryString(search);

    const pivotItems = NAV_LINK_ITEMS.map(nav =>  {
        const text = t((ResourceKeys.deviceContent.navBar as any)[nav]); // tslint:disable-line:no-any
        const path = pathname.replace(/\/moduleIdentity\/.*/, `/${ROUTE_PARTS.MODULE_IDENTITY}`);
        const url = `#${path}/${nav}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}&${ROUTE_PARAMS.MODULE_ID}=${encodeURIComponent(moduleId)}`;
        const isCurrentPivot = pathname.indexOf(nav) > 0;
        return (
            <Stack.Item className={`pivot-item ${isCurrentPivot ? 'pivot-item-active' : ''}`} key={nav}>
                <ActionButton href={url} >
                    {text}
                </ActionButton>
            </Stack.Item>
        );
    });

    return (
        <Stack horizontal={true} className="pivot">
            {pivotItems}
        </Stack>
    );
};
