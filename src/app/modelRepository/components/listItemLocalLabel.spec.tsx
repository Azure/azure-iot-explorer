/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { ListItemLocalLabel } from './listItemLocalLabel';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';

describe('ListItemLocalLabel', () => {
    it('renders local label for Local type', () => {
        render(<ListItemLocalLabel repoType={REPOSITORY_LOCATION_TYPE.Local}/>);

        expect(screen.getByText('modelRepository.types.local.label')).toBeDefined();
        expect(screen.getByText('modelRepository.types.local.infoText')).toBeDefined();
    });

    it('renders DMR label for LocalDMR type', () => {
        render(<ListItemLocalLabel repoType={REPOSITORY_LOCATION_TYPE.LocalDMR}/>);

        expect(screen.getByText('modelRepository.types.dmr.label')).toBeDefined();
    });
});
