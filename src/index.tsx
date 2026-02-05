/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { initializeIcons } from '@fluentui/react';
import { Themer } from './themer';
import i18n from './i18n';
import { Application } from './app/shared/components/application';
import { GlobalContextProvider } from './app/shared/global/context/globalContext';
import { initializeAppSettings } from './app/shared/utils/appInitialization';
import './app/css/_index.scss';
import './app/css/_layouts.scss';

initializeIcons();

const ViewHolder: React.FC = () => {
    return (
        <I18nextProvider i18n={i18n}>
            <GlobalContextProvider>
                <Themer>
                    <HashRouter>
                        <Application />
                    </HashRouter>
                </Themer>
            </GlobalContextProvider>
        </I18nextProvider>
    );
};

// Initialize app settings (e.g., custom port from main process) before rendering
initializeAppSettings().finally(() => {
    ReactDOM.render(
        <ViewHolder />,
        document.getElementById('device-explorer'),
    );
});
