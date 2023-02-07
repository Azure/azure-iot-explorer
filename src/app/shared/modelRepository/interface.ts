/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ModelRepositoryStateInterface } from "./state";

export interface ModelRepositoryInterface {
    setRepositoryLocations(settings: ModelRepositoryStateInterface): void;
}

export const getInitialModelRepositoryActions = (): ModelRepositoryInterface => ({
    setRepositoryLocations: () => undefined
});
