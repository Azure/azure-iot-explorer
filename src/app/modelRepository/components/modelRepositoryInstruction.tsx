/***********************************************************
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License
**********************************************************/
import * as React from 'react';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Text } from 'office-ui-fabric-react/lib/text';
import { NavLink } from 'react-router-dom';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { useLocalizationContext } from '../../shared/contexts/localizationContext';
import { ROUTE_PARTS } from '../../constants/routes';
import './modelRepositoryInstruction.scss';

export interface ModelRepositoryInstructionDataProps {
    empty: boolean;
}

export const ModelRepositoryInstruction: React.FC<ModelRepositoryInstructionDataProps> = props => {
    const { t } = useLocalizationContext();

    if (props.empty) {
        return (
            <div className="model-repository-empty">
                <h3 role="heading" aria-level={1}>{t(ResourceKeys.modelRepository.empty.header)}</h3>
                <div>
                    <span>{t(ResourceKeys.modelRepository.empty.description)}</span>
                    <NavLink to={`/${ROUTE_PARTS.HOME}/${ROUTE_PARTS.MODEL_REPOS}`} className="embedded-link">Home.</NavLink>
                </div>

                <h3 role="heading" aria-level={1}>{t(ResourceKeys.settings.questions.headerText)}</h3>
                <Link
                    href={t(ResourceKeys.settings.questions.questions.documentation.link)}
                    target="_blank"
                >
                    {t(ResourceKeys.modelRepository.empty.help)}
                </Link>
            </div>);
    }

    return (
        <div className="model-repository-instruction">
            {t(ResourceKeys.modelRepository.instruction)}
        </div>
    );
};
