/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useBreadcrumbContext } from '../hooks/useBreadcrumbContext';
import { BreadcrumbEntry } from './breadcrumbEntry';
import '../../css/_breadcrumb.scss';

export const Breadcrumb: React.FC = () => {
    const { stack } = useBreadcrumbContext();

    return (
        <ul className="breadcrumb">
            {stack.map((s, i) =>
                <BreadcrumbEntry key={s.path} {...{...s, link: s.link && i !== stack.length - 1}}/>
            )}
        </ul>
    );
};
