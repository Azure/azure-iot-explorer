/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Prompt } from 'react-router-dom';
import { ResourceKeys } from '../../localization/resourceKeys';
import { ModelRepositoryLocationList } from './components/modelRepositoryLocationList';
import { ModelRepositoryInstruction } from './components/modelRepositoryInstruction';
import { useBreadcrumbEntry } from '../navigation/hooks/useBreadcrumbEntry';
import { AppInsightsClient } from '../shared/appTelemetry/appInsightsClient';
import { TELEMETRY_PAGE_NAMES } from '../constants/telemetry';
import { Commands } from './components/commands';
import { useModelRepositoryForm } from './hooks/useModelRepositoryForm';

export const ModelRepositoryLocationView: React.FC = () => {
    const { t } = useTranslation();
    useBreadcrumbEntry({ name: t(ResourceKeys.breadcrumb.ioTPlugAndPlay)});
    const formState = useModelRepositoryForm();

    React.useEffect(() => {
        AppInsightsClient.getInstance()?.trackPageView({name: TELEMETRY_PAGE_NAMES.PNP_REPO_SETTINGS});
    }, []); // tslint:disable-line: align

    return (
        <div>
            <Prompt when={formState[0].dirty} message={t(ResourceKeys.common.navigation.confirm)}/>
            <Commands formState={formState}/>
            <div>
                <ModelRepositoryInstruction/>
                <ModelRepositoryLocationList formState={formState}/>
            </div>
        </div>
    );
};
