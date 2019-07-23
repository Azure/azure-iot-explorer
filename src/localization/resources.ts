/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
const en = require('./locales/en.json'); // tslint:disable-line: no-var-requires

export interface AllowedLanguage {
    key: string;
    text: string;
}

export const ALLOWED_LANGUAGES: AllowedLanguage[] = [
    {
        key: 'en',
        text: 'English',
    },
];

const resources = {
    en: { translation: en },
};

export default resources;
