/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { TranslationFunction } from 'i18next';
import { withNamespaces } from 'react-i18next';
import { LocalizationContextProvider } from '../contexts/localizationContext';

const TRANSLATION_NAMESPACE = 'translation';
export const Localizer: React.FC<{ t: TranslationFunction}> = props => {
    return (
        <LocalizationContextProvider value={{t: props.t}}>
            {props.children}
        </LocalizationContextProvider>
    );
};

export default withNamespaces(TRANSLATION_NAMESPACE)(Localizer as any); // tslint:disable-line: no-any
