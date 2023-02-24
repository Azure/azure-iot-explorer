/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { REPOSITORY_LOCATION_TYPE } from '../../../constants/repositoryLocationTypes';
import { interfaceId, modelDefinition, modelDefinitionWithInlineComp, schemaId } from "./testData";
import { getFlattenedModel, getLocationSettingValue, getDmrParams } from "./utils";

describe('utils ', () => {
    it('flattens model definition when feasible', () => {
        expect(getFlattenedModel(modelDefinition, [interfaceId])).toEqual(modelDefinition);

        expect(getFlattenedModel(modelDefinitionWithInlineComp, [interfaceId, schemaId])).toEqual(modelDefinitionWithInlineComp.contents?.[0]);
    });

    it('gets specific location setting values', () => {
        const locations = [{
            repositoryLocationType: REPOSITORY_LOCATION_TYPE.Public,
            value: ''
        },
        {
            repositoryLocationType: REPOSITORY_LOCATION_TYPE.Configurable,
            value: 'test.com'
        },
        {
            repositoryLocationType: REPOSITORY_LOCATION_TYPE.Local,
            value: 'c:/test/folder/models/'
        },
        {
            repositoryLocationType: REPOSITORY_LOCATION_TYPE.LocalDMR,
            value: 'd:/test/dtmi'
        }];

        expect(getLocationSettingValue(locations, REPOSITORY_LOCATION_TYPE.Configurable)).toEqual('test.com');
        expect(getLocationSettingValue(locations, REPOSITORY_LOCATION_TYPE.Local)).toEqual('c:/test/folder/models');
        expect(getLocationSettingValue(locations, REPOSITORY_LOCATION_TYPE.LocalDMR)).toEqual('d:/test/dtmi');
    });

    it('gets expected dmr params', () => {
        expect(getDmrParams('d:/test/dtmi', interfaceId)).toEqual({folderPath: 'd:/test/dtmi/com/example', fileName: 'thermostat-1.json'});
    });
});