/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Label } from '@fluentui/react';

interface ErrorBoundaryProps {
    error: string;
}
interface ErrorBoundaryState {
    hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState>{
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false
        };
    }

    public componentDidCatch() {
        this.setState({
            hasError: true
        });
    }

    public render() {
        if (this.state.hasError) {
            return <Label >{this.props.error}</Label>;
        }
        return this.props.children;
    }
}
