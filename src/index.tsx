/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { Themer } from './themer';
import i18n from './i18n';
import { Application } from './app/shared/components/application';
import { GlobalContextProvider } from './app/shared/global/context/globalContext';
import './app/css/_index.scss';
import './app/css/_layouts.scss';

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

const container = document.getElementById('device-explorer');
const root = createRoot(container!);
root.render(<ViewHolder />);
