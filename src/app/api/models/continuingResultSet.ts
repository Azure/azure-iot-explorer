/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export interface ContinuingResultSet<T> {
    resultSet: T[];
    continuationToken: string;
}
