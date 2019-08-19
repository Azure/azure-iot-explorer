/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { ModelDefinition } from './../models/modelDefinition';

export const transformModelDefinition = (model: ModelDefinition): ModelDefinition => {
    return {
        ...model,
        description: getLocalizedData(model.description),
        displayName: getLocalizedData(model.displayName)
    };
};

// tslint:disable-next-line:cyclomatic-complexity
export const getLocalizedData = (data: string | object) => {
    if (typeof(data) === 'string')
    {
        return data;
    }

    try {
        const LOCAL_DEFAULT = 'en';
        const keys = Object.keys(data);
        if (!keys || keys.length === 0 || !keys.some(key => key === LOCAL_DEFAULT)) {
            return '';
        }
        else {
            // tslint:disable-next-line:no-any
            return (data as any)[LOCAL_DEFAULT];
        }
    }
    catch {
        return '';
    }
};
