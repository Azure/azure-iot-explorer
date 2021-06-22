/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '@fluentui/react';
import { ResourceKeys } from '../../../localization/resourceKeys';
import '../../css/_noMatchError.scss';

export const NoMatchError = () => {
    const { t } = useTranslation();
    return (
        <div className="no-match-error">
            <div className="no-match-error-description">
                <h2>{t(ResourceKeys.noMatchError.title)}</h2>
                <p>{t(ResourceKeys.noMatchError.description)}</p>
            </div>
            <div className="no-match-error-button">
                <PrimaryButton
                    ariaDescription={t(ResourceKeys.noMatchError.goHome)}
                    href={'#'}
                >
                    {t(ResourceKeys.noMatchError.goHome)}
                </PrimaryButton>
            </div>
        </div>
    );
};
