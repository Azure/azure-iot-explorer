/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ModelDefinition } from './../../../../api/models/modelDefinition';
import { PropertyContent } from '../../../../api/models/modelDefinition';
import { StateInterface } from '../../../../shared/redux/state';
import { getModelDefinitionSelector, getComponentNameSelector } from '../../selectors';
import { DeviceInterfaceWithSchema } from './deviceSettings';
import { getReportedValueForSpecificProperty, getDigitalTwinForSpecificComponent } from '../deviceProperties/selectors';
import { JsonSchemaAdaptor } from './../../../../shared/utils/jsonSchemaAdaptor';

export const getDeviceSettingTupleSelector = (state: StateInterface) => {
    const modelDefinition = getModelDefinitionSelector(state);
    return modelDefinition && generateTwinSchemaAndInterfaceTuple(state, modelDefinition);
};

const generateTwinSchemaAndInterfaceTuple = (state: StateInterface, model: ModelDefinition): DeviceInterfaceWithSchema => {
    const jsonSchemaAdaptor = new JsonSchemaAdaptor(model);
    const writableProperties = jsonSchemaAdaptor.getWritableProperties();

    const settings = writableProperties
        .map(setting => {
            return {
                isComponentContainedInDigitalTwin: !!getDigitalTwinForSpecificComponent(state),
                metadata: getMetadataSectionForSpecificProperty(state, setting),
                reportedTwin: getReportedValueForSpecificProperty(state, setting),
                settingModelDefinition: setting,
                settingSchema: jsonSchemaAdaptor.parseInterfacePropertyToJsonSchema(setting)
            };
        });

    return {
        componentName: getComponentNameSelector(state),
        interfaceId: model['@id'],
        twinWithSchema: settings,
    };
};

export interface MetadataSection {
    desiredValue?: boolean | string | number | object;
    desiredVersion?: number;
    ackVersion?: number;
    ackCode?: number;
    ackDescription?: string;
    lastUpdatedTime?: string;
}

const getMetadataSectionForSpecificProperty = (state: StateInterface, property: PropertyContent): MetadataSection => {
    const digitalTwinForSpecificComponent = getDigitalTwinForSpecificComponent(state);
    return digitalTwinForSpecificComponent &&
        digitalTwinForSpecificComponent.$metadata &&
        digitalTwinForSpecificComponent.$metadata[property.name];
};
