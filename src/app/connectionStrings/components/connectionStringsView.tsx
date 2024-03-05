/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ConnectionStringEditView } from './connectionStringEditView';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { useBreadcrumbEntry } from '../../navigation/hooks/useBreadcrumbEntry';
import { AppInsightsClient } from '../../shared/appTelemetry/appInsightsClient';
import { TELEMETRY_PAGE_NAMES } from '../../constants/telemetry';
import { ConnectionStringCommandBar } from './commandBar';

export const ConnectionStringsView: React.FC = () => {
    const { t } = useTranslation();
    useBreadcrumbEntry({name: t(ResourceKeys.breadcrumb.resources)});

    React.useEffect(() => {
        AppInsightsClient.getInstance()?.trackPageView({name: TELEMETRY_PAGE_NAMES.HUBS});
    }, []); // tslint:disable-line: align

    return (
        <>
            <ConnectionStringCommandBar/>
            <ConnectionStringEditView/>
        </>
    );
};
