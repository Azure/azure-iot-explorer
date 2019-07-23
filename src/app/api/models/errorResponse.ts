/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export interface ErrorResponse {
    error: {
         code?: number,
         message: string
     };
     traceIdentifier?: string;
     sourceId?: string;
}
