/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ERROR_TYPES } from './../../constants/apiConstants';

export class AuthorizationRuleNotFoundError extends Error {
    public requiredPermissions: string[];
    constructor(requiredPermissions: string[]) {
        super(ERROR_TYPES.AUTHORIZATION_RULE_NOT_FOUND);
        this.name = this.message;
        this.requiredPermissions = requiredPermissions;
    }
}
