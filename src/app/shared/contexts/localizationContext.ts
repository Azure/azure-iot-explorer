/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { TranslationFunction } from 'i18next';

interface LocalizationContextInterface {
    t: TranslationFunction;
}

const LocalizationContext = React.createContext<LocalizationContextInterface>({t: key => key});
export const LocalizationContextProvider = LocalizationContext.Provider;
export const useLocalizationContext = () => React.useContext(LocalizationContext);
