/***********************************************************
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License
**********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@fluentui/react';
import { NavLink } from 'react-router-dom';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { ROUTE_PARTS } from '../../constants/routes';
import './modelRepositoryInstruction.scss';

export interface ModelRepositoryInstructionDataProps {
    empty: boolean;
}

export const ModelRepositoryInstruction: React.FC<ModelRepositoryInstructionDataProps> = props => {
    const { t } = useTranslation();

    return (
        <div className="model-repository-instruction">
            <div>
                <span>{t(ResourceKeys.modelRepository.description.description)}</span>
                <NavLink to={`/${ROUTE_PARTS.HOME}/${ROUTE_PARTS.MODEL_REPOS}`} className="embedded-link">Home.</NavLink>
            </div>

            <h3 role="heading" aria-level={1}>{t(ResourceKeys.settings.questions.headerText)}</h3>
            <Link
                href={t(ResourceKeys.settings.questions.questions.documentation.link)}
                target="_blank"
            >
                {t(ResourceKeys.modelRepository.description.help)}
            </Link>
            <h3 role="heading" aria-level={1}>{t(ResourceKeys.modelRepository.description.header)}</h3>
            {t(ResourceKeys.modelRepository.instruction)}
            {RenderPrivaryStatement()}
        </div>);
};

const RenderPrivaryStatement = () => {
    const { t } = useTranslation();
    return (
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
};
