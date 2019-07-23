/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Exception } from './exception';

export class InterfaceNotImplementedException extends Exception  {

    protected setTypeName() {
        this.type = 'interfaceNotImplementedException';
    }
}
