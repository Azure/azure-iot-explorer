/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { DirectMethod, DirectMethodProps } from './directMethod';
import { FunctionProperties } from '../../../../shared/types/types';
import { InvokeMethodParameters } from '../../../../api/parameters/deviceParameters';
import { invokeDirectMethodAction } from '../../actions';

const mapDispatchToProps = (dispatch: Dispatch): FunctionProperties<DirectMethodProps> => {
    return {
        onInvokeMethodClick: (parameters: InvokeMethodParameters) => dispatch(invokeDirectMethodAction.started(parameters))
    };
};

export default connect(undefined, mapDispatchToProps)(DirectMethod);
