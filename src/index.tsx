/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import i18next from 'i18next';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import Themer from './themer';
import resources from './localization/resources';
import App from './app/shared/components/application';
import configureStore from './app/shared/redux/store/configureStore';

const defaultLanguage = 'en';
const fallbackLanguage = 'en';

initializeIcons();

const i18n = i18next.init({
    fallbackLng: fallbackLanguage,
    interpolation: { escapeValue: false },
    lng: defaultLanguage,
    parseMissingKeyHandler: (key: string) => {
        return `No translation found for "${key}"`;
    },
    resources,
});

const store = configureStore();

const ViewHolder =  () => (
    <I18nextProvider i18n={i18next}>
        <Provider store={store}>
            <Themer>
                <App />
            </Themer>
        </Provider>
    </I18nextProvider>
);

ReactDOM.render(
    <ViewHolder />,
    document.getElementById('device-explorer'),
);
