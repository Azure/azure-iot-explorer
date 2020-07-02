/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import React, { Component } from 'react';
import { Label } from 'office-ui-fabric-react/lib/components/Label';
import { ApplicationClient } from '../../../shared/appTelemetry/applicationInsightClient';

interface ErrorBoundaryProps {
    error: string;
}
interface ErrorBoundaryState {
    hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState>{
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
        ApplicationClient.getInstance().trackEvent({name: `error: ${this.props.error}`}, {type: 'error'});
    }

    public render() {
        if (this.state.hasError) {
            return <Label >{this.props.error}</Label>;
        }
        return this.props.children;
    }
}
