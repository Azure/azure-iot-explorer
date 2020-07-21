/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ModelDefinition } from './modelDefinition';

export interface PnPModel {
    createdDate: string;
    etag: string;
    model: ModelDefinition;
    modelId: string;
    publisherId: string;
    publisherName: string;
}

export interface LocaleValue {
    locale: string;
    value: string;
}

export enum MetaModelType {
    none = 'none',
    interface = 'interface',
    capabilityModel = 'capabilityModel'
}

export interface SearchResults {
    continuationToken: string;
    results: PnPModel[];
}
