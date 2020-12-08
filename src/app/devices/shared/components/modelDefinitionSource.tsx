/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Stack } from 'office-ui-fabric-react/lib/components/Stack';
import { ActionButton } from 'office-ui-fabric-react/lib/components/Button';
import { Label } from 'office-ui-fabric-react/lib/components/Label';
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
    const history = useHistory();

    const onConfigureClick = () => {
        history.push(`/${ROUTE_PARTS.HOME}/${ROUTE_PARTS.MODEL_REPOS}?${ROUTE_PARAMS.NAV_FROM}`);
    };

    return (
        <Stack horizontal={true}>
            <Stack.Item align="start">
                <Label>{t(ResourceKeys.deviceInterfaces.columns.source)}: {t(getModelDefinitionSourceResourceKeys(props.source))}</Label>
            </Stack.Item>

            <Stack.Item align="center">
                <ActionButton
                    className="configure-button"
                    onClick={onConfigureClick}
                    iconProps={{iconName: 'Settings'}}
                >
                    {t(ResourceKeys.deviceInterfaces.command.configure)}
                </ActionButton>
            </Stack.Item>
        </Stack>
    );
};
