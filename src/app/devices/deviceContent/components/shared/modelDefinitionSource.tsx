/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { useLocalizationContext } from '../../../../shared/contexts/localizationContext';
import { REPOSITORY_LOCATION_TYPE } from '../../../../constants/repositoryLocationTypes';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import '../../../../css/_modelDefinitionSource.scss';

interface ModelDefinitionSourceViewProps {
    source: REPOSITORY_LOCATION_TYPE;
    handleConfigure: () => void;
}

const getModelDefinitionSourceResourceKeys = (source: string) => {
    switch (source) {
        case REPOSITORY_LOCATION_TYPE.Public:
            return ResourceKeys.settings.modelDefinitions.repositoryTypes.public.label;
        case REPOSITORY_LOCATION_TYPE.Private:
            return ResourceKeys.settings.modelDefinitions.repositoryTypes.private.label;
        case REPOSITORY_LOCATION_TYPE.Device:
            return ResourceKeys.settings.modelDefinitions.repositoryTypes.device.label;
        case REPOSITORY_LOCATION_TYPE.Local:
            return ResourceKeys.settings.modelDefinitions.repositoryTypes.local.labelInElectron;
        default:
            return ResourceKeys.settings.modelDefinitions.repositoryTypes.notAvailable;
    }
};

export const ModelDefinitionSourceView: React.FC<ModelDefinitionSourceViewProps> = props => {
    const { t } = useLocalizationContext();
    return (
        <Stack horizontal={true}>
            <Stack.Item align="start">
                <Label>{t(ResourceKeys.deviceInterfaces.columns.source)}: {t(getModelDefinitionSourceResourceKeys(props.source))}</Label>
            </Stack.Item>

            <Stack.Item align="center">
                <ActionButton
                    className="configure-button"
                    onClick={props.handleConfigure}
                >
                        {t(ResourceKeys.deviceInterfaces.command.configure)}
                </ActionButton>
            </Stack.Item>
        </Stack>
    );
};
