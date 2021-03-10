/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useHistory } from 'react-router-dom';
import { Stack } from 'office-ui-fabric-react/lib/components/Stack';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/components/Pivot';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../../constants/routes';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString, getModuleIdentityIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import './moduleIdentityDetailHeader.scss';

export const ModuleIdentityDetailHeader: React.FC = () => {
    const { t } = useTranslation();
    const { search, pathname } = useLocation();
    const history = useHistory();

    const NAV_LINK_ITEMS = [ROUTE_PARTS.MODULE_DETAIL, ROUTE_PARTS.MODULE_TWIN, ROUTE_PARTS.MODULE_METHOD, ROUTE_PARTS.MODULE_PNP];
    const deviceId = getDeviceIdFromQueryString(search);
    const moduleId = getModuleIdentityIdFromQueryString(search);

    const [selectedKey, setSelectedKey] = React.useState((NAV_LINK_ITEMS.find(item => pathname.indexOf(item) > 0) || ROUTE_PARTS.MODULE_DETAIL).toString());
    const path = pathname.replace(/\/moduleIdentity\/.*/, `/${ROUTE_PARTS.MODULE_IDENTITY}`);
    const pivotItems = NAV_LINK_ITEMS.map(nav =>  {
        const text = t((ResourceKeys.breadcrumb as any)[nav]); // tslint:disable-line:no-any
        return (<PivotItem key={nav} headerText={text} itemKey={nav} />);
    });

    const handleLinkClick = (item: PivotItem) => {
        setSelectedKey(item.props.itemKey);
        const url = `${path}/${item.props.itemKey}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}&${ROUTE_PARAMS.MODULE_ID}=${encodeURIComponent(moduleId)}`;
        history.push(url);
    };

    const pivot = (
        <Pivot
            aria-label={t(ResourceKeys.digitalTwin.pivot.ariaLabel)}
            selectedKey={selectedKey}
            onLinkClick={handleLinkClick}
        >
            {pivotItems}
        </Pivot>
    );

    return (
        <Stack horizontal={true} className="module-pivot">
            {pivot}
        </Stack>
    );
};
