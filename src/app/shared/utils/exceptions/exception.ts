/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export abstract class Exception {
    public type: string;
    public message: string;

    protected abstract setTypeName(): void;

    constructor() {
        this.setTypeName();
    }
}
