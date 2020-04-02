/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AnyAction } from 'typescript-fsa';
import { DigitalTwinContentDispatchProps, DigitalTwinContent } from './digitalTwinContent';
import { getModelDefinitionAction, getDigitalTwinInterfacePropertiesAction } from '../../actions';

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): Partial<DigitalTwinContentDispatchProps> => {
    return {
        fetchModelDefinition: (deviceId: string, interfaceId: string) => dispatch(getModelDefinitionAction.started({digitalTwinId: deviceId, interfaceId})),
        getDigitalTwinInterfaceProperties: (deviceId: string) => dispatch(getDigitalTwinInterfacePropertiesAction.started(deviceId))
    };
};

export default connect(undefined, mapDispatchToProps, undefined, {
    pure: false,
})(DigitalTwinContent);
