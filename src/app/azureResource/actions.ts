/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/

import actionCreatorFactory from 'typescript-fsa';
import { SET } from '../constants/actionTypes';
import { AzureResource } from './models/azureResource';

export const AZURE_RESOURCES = 'AZURE_RESOURCES';
const actionCreator = actionCreatorFactory(AZURE_RESOURCES);

export const setAzureResource = actionCreator<AzureResource>(SET);
