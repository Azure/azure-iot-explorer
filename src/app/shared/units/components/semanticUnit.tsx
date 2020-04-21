/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { getSemanticUnit } from '../semanticUnits';
import { getLocalizedData } from '../../../api/dataTransforms/modelDefinitionTransform';

export interface SemanticUnitProps {
    unitHost?: {unit?: string};
}

export const SemanticUnit: React.FC<SemanticUnitProps> = props => {
    const { unitHost } = props;
    const emptyUnit = '--';
    if (!unitHost || !unitHost.unit) {
        return <span>{emptyUnit}</span>;
    }

    const semanticUnit = getSemanticUnit(unitHost.unit);
    if (!semanticUnit) {
        return <span>{unitHost.unit}</span>;
    } else {
        const title = getLocalizedData(semanticUnit.displayName);
        return <span title={title}>{semanticUnit.abbreviation}</span>;
    }
};
