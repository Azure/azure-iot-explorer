/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/

export const getShortHostName = (name: string) => {
    return name && name.replace(/\..*/, '');
};
