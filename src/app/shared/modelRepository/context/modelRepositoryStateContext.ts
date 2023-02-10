/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { getInitialModelRepositoryActions, ModelRepositoryInterface } from '../interface';
import { ModelRepositoryStateInterface, getInitialModelRepositoryState } from '../state';

const ModelRepositoryContext = React.createContext<[ModelRepositoryStateInterface, ModelRepositoryInterface]>(
    [getInitialModelRepositoryState(), getInitialModelRepositoryActions()]
);
export const ModelRepositoryContextProvider = ModelRepositoryContext.Provider;
export const useModelRepositoryContext = () => React.useContext(ModelRepositoryContext);
