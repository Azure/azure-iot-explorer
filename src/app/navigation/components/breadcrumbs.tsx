/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useBreadcrumbContext } from '../hooks/useBreadcrumbContext';
import { Breadcrumb } from './breadcrumb';
import '../../css/_breadcrumb.scss';

export const Breadcrumbs: React.FC = () => {
    const { stack } = useBreadcrumbContext();

    return (
        <ul className="breadcrumb">
            {stack.map((s, i) =>
                <Breadcrumb key={s.path} {...{...s, disableLink: s.disableLink || i === stack.length - 1}}/>
            )}
        </ul>
    );
};
