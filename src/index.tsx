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
import { Application } from './app/shared/components/application';
import { useAsyncSagaReducer } from './app/shared/hooks/useAsyncSagaReducer';
import { globalStateInitial } from './app/shared/global/state';
import { GlobalStateProvider } from './app/shared/contexts/globalStateContext';
import { globalReducer } from './app/shared/global/reducer';
import { globalSaga } from './app/shared/global/saga';
import { useBreadcrumbs } from './app/navigation/hooks/useBreadcrumbs';
import { BreadcrumbContext } from './app/navigation/hooks/useBreadcrumbContext';
import { i18n } from './i18n';
import './app/css/_index.scss';

initializeIcons();

const ViewHolder: React.FC = () => {
    const [ globalState, dispatch ] = useAsyncSagaReducer(globalReducer, globalSaga, globalStateInitial(), 'globalState');
    const breadcrumbs = useBreadcrumbs();

    return (
        <I18nextProvider i18n={i18n}>
            <GlobalStateProvider value={{ globalState, dispatch }}>
                <BreadcrumbContext.Provider value={breadcrumbs}>
                    <Themer>
                        <HashRouter>
                            <Application />
                        </HashRouter>
                    </Themer>
                </BreadcrumbContext.Provider>
            </GlobalStateProvider>
        </I18nextProvider>
    );
};

ReactDOM.render(
    <ViewHolder />,
    document.getElementById('device-explorer'),
);
