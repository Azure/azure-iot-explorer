/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Exception } from './exception';

export class ModelIdCasingNotMatchingException extends Exception  {

    protected setTypeName() {
        this.type = 'modelIdCasingNotMatchingException';
    }
}
