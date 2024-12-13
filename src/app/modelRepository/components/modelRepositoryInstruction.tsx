/***********************************************************
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License
**********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@fluentui/react';
import { ResourceKeys } from '../../../localization/resourceKeys';
import './modelRepositoryInstruction.scss';

export const ModelRepositoryInstruction: React.FC = () => {
    const { t } = useTranslation();

    const privacyStatement =  (
        <div className="privacy-statement">
            <span>{t(ResourceKeys.settings.questions.questions.privacy.text)}</span>
            <Link
                href={t(ResourceKeys.settings.questions.questions.privacy.link)}
                target="_blank"
            >
                {t(ResourceKeys.settings.questions.questions.privacy.linkText)}
            </Link>
        </div>
    );

    return (
        <div className="model-repository-instruction">
            <span>{t(ResourceKeys.modelRepository.description.description)}</span>
            <h3 role="heading" aria-level={1}>{t(ResourceKeys.settings.questions.headerText)}</h3>
            <Link
                href={t(ResourceKeys.settings.questions.questions.documentation.link)}
                target="_blank"
            >
                {t(ResourceKeys.modelRepository.description.help)}
            </Link>
            <h3 role="heading" aria-level={1}>{t(ResourceKeys.modelRepository.description.header)}</h3>
            {t(ResourceKeys.modelRepository.instruction)}
            {privacyStatement}
        </div>
    );
};
