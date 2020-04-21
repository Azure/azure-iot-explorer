/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { StringMap } from '../../api/models/stringMap';

export interface SemanticUnit {
    displayName: string | StringMap<string>;
    abbreviation: string;
}

export const semanticUnits = require('./semanticUnitsList.json'); // tslint:disable-line: no-var-requires
export const getSemanticUnit = (unitName: string | undefined): SemanticUnit | undefined => {
    return unitName && semanticUnits[unitName];
};
