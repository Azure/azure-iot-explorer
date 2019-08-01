/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { MetaModelType } from '../models/metamodelMetadata';

export interface RepoParametersBase {
    repoServiceHostName: string;
    repositoryId?: string;
}

export interface FetchModelsParameters extends RepoParametersBase {
    metaModelType?: MetaModelType;
    pageSize?: number;
    continuationToken?: string;
}

export interface FetchModelParameters extends RepoParametersBase {
    id: string;
    expand?: boolean;
    token: string;
}

export interface FetchModelsParameters extends RepoParametersBase {
    ids?: string[];
    token: string;
}
