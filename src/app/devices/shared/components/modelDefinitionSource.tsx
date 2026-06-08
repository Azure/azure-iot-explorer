/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Label } from '@fluentui/react-components';
import { SettingsRegular } from '@fluentui/react-icons';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../constants/routes';
import { REPOSITORY_LOCATION_TYPE } from '../../../constants/repositoryLocationTypes';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import '../../../css/_modelDefinitionSource.scss';

interface ModelDefinitionSourceViewProps {
    source: REPOSITORY_LOCATION_TYPE;
}

const getModelDefinitionSourceResourceKeys = (source: REPOSITORY_LOCATION_TYPE) => {
    if (Object.values(REPOSITORY_LOCATION_TYPE).includes(source)) {
        // tslint:disable-next-line:no-any
        return (ResourceKeys.modelRepository.types as any)[source.toLowerCase()].label;
    }
    return ResourceKeys.modelRepository.types.notAvailable;
};

export const ModelDefinitionSourceView: React.FC<ModelDefinitionSourceViewProps> = props => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const onConfigureClick = () => {
        navigate(`/${ROUTE_PARTS.HOME}/${ROUTE_PARTS.MODEL_REPOS}?${ROUTE_PARAMS.NAV_FROM}`);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Label>{t(ResourceKeys.deviceInterfaces.columns.source)}: {t(getModelDefinitionSourceResourceKeys(props.source))}</Label>
            <Button
                appearance="transparent"
                className="configure-button"
                onClick={onConfigureClick}
                icon={<SettingsRegular />}
            >
                {t(ResourceKeys.deviceInterfaces.command.configure)}
            </Button>
        </div>
    );
};
