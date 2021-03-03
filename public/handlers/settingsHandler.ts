/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { nativeTheme } from 'electron';

export const onSettingsHighContrast = (): boolean => {
    const highContrast = nativeTheme.shouldUseHighContrastColors;
    return highContrast;
};
