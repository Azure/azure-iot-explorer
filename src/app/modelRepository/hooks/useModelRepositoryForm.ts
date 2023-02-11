/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useModelRepositoryContext } from '../../shared/modelRepository/context/modelRepositoryStateContext';
import { StringMap } from '../../api/models/stringMap';
import { ModelRepositoryStateInterface } from '../../shared/modelRepository/state';

export type ModelRepositoryFormType = [{
        dirty: boolean;
        repositoryLocationSettings: ModelRepositoryStateInterface;
        repositoryLocationSettingsErrors: StringMap<string>;
    },
    {
        setDirtyFlag: (dirty: boolean) => void;
        setRepositoryLocationSettings: (settings: ModelRepositoryStateInterface) => void;
        setRepositoryLocationSettingsErrors: (errors: StringMap<string> ) => void;
    }
];

export const useModelRepositoryForm = (): ModelRepositoryFormType => {
    const [ modelRepositoryState, ] = useModelRepositoryContext();
    const [ repositoryLocationSettings, setRepositoryLocationSettings ] = React.useState<ModelRepositoryStateInterface>(modelRepositoryState);
    const [ repositoryLocationSettingsErrors, setRepositoryLocationSettingsErrors ] = React.useState<StringMap<string>>({});
    const [ dirty, setDirtyFlag ] = React.useState<boolean>(false);

    return [{repositoryLocationSettings, repositoryLocationSettingsErrors, dirty }, {setRepositoryLocationSettings, setRepositoryLocationSettingsErrors, setDirtyFlag}];
};
