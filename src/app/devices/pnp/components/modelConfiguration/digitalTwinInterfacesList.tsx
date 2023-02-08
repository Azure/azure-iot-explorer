/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { HeaderView } from '../../../../shared/components/headerView';
import { MultiLineShimmer } from '../../../../shared/components/multiLineShimmer';
import { usePnpStateContext } from '../../context/pnpStateContext';
import { AppInsightsClient } from '../../../../shared/appTelemetry/appInsightsClient';
import { TELEMETRY_PAGE_NAMES } from '../../../../constants/telemetry';
import { Command } from './command';
import { DigitaltwinPnpConfigurationSteps } from './digitaltwinPnpConfigurationSteps';
import '../../../../css/_digitalTwinInterfaces.scss';

// tslint:disable-next-line: cyclomatic-complexity
export const DigitalTwinInterfacesList: React.FC = () => {
    const { pnpState } = usePnpStateContext();
    const twinSynchronizationStatus = pnpState.twin.synchronizationStatus;
    const isTwinLoading = twinSynchronizationStatus === SynchronizationStatus.working;

    React.useEffect(() => {
        AppInsightsClient.getInstance()?.trackPageView({name: TELEMETRY_PAGE_NAMES.PNP_HOME});
    }, []); // tslint:disable-line: align

    return (
        <>
            <Command/>
            <HeaderView
                headerText={ResourceKeys.digitalTwin.headerText}
                link={ResourceKeys.settings.questions.questions.documentation.link}
                tooltip={ResourceKeys.settings.questions.questions.documentation.text}
            />
            {isTwinLoading ?
                <MultiLineShimmer/> :
                <DigitaltwinPnpConfigurationSteps/>
            }
        </>
    );
};
