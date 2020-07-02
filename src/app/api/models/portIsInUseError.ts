/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ERROR_TYPES } from '../../constants/apiConstants';

export class PortIsInUseError extends Error {
    constructor() {
        super(ERROR_TYPES.PORT_IS_IN_USE);
        this.name = this.message;
    }
}
