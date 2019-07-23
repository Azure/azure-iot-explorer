/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { TranslationFunction } from 'i18next';

interface LocalizationContextInterface {
    t: TranslationFunction;
}

const LocalizationContext = React.createContext({});
const LocalizationContextProvider = LocalizationContext.Provider;
const LocalizationContextConsumer = LocalizationContext.Consumer;

export { LocalizationContext, LocalizationContextConsumer, LocalizationContextProvider, LocalizationContextInterface };
