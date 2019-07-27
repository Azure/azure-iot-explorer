/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { Text } from 'office-ui-fabric-react/lib/Text';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { validateConnectionString } from '../../shared/utils/hubConnectionStringHelper';
import { CopyableMaskField } from '../../shared/components/copyableMaskField';
import LabelWithTooltip from '../../shared/components/labelWithTooltip';
import { SetConnectionStringActionParameter } from '../actions';
import '../../css/_connectivityPane.scss';

export interface ConnectivityPaneDispatchProps {
    saveConnectionInfo: (connectionStringSetting: SetConnectionStringActionParameter) => void;
}

export interface ConnectivityPaneDataProps {
    connectionString: string;
    rememberConnectionString: boolean;
}

export interface ConnectivityState {
    connectionString: string;
    error: string;
    rememberConnectionString: boolean;
}

export default class ConnectivityPane extends React.Component<RouteComponentProps & ConnectivityPaneDataProps & ConnectivityPaneDispatchProps, ConnectivityState> {
    constructor(props: RouteComponentProps & ConnectivityPaneDataProps & ConnectivityPaneDispatchProps) {
        super(props);
        this.state = {
            connectionString: this.props.connectionString,
            error: '',
            rememberConnectionString: this.props.rememberConnectionString
        };
    }

    public render(): JSX.Element {
        const { connectionString, error } = this.state;

        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <div className="connectivity-pane" role="main">

                        <div className="main" role="dialog">
                            <h1>
                                {context.t(ResourceKeys.connectivityPane.header)}
                            </h1>

                            <div className="connection-string">
                                <CopyableMaskField
                                    ariaLabel={context.t(ResourceKeys.connectivityPane.connectionStringTextBox.label)}
                                    label={context.t(ResourceKeys.connectivityPane.connectionStringTextBox.label)}
                                    error={!!error ? context.t(error) : ''}
                                    value={connectionString}
                                    allowMask={true}
                                    onTextChange={this.onConnectionStringChanged}
                                    readOnly={false}
                                    required={true}
                                    t={context.t}
                                />
                            </div>

                            <div className="remember-connection-string">
                                <Checkbox
                                    ariaLabel={context.t(ResourceKeys.connectivityPane.connectionStringCheckbox.ariaLabel)}
                                    onChange={this.onCheckboxChange}
                                    checked={this.state.rememberConnectionString}
                                />
                                <LabelWithTooltip
                                    tooltipText={context.t(ResourceKeys.connectivityPane.connectionStringCheckbox.tooltip)}
                                >
                                    {context.t(ResourceKeys.connectivityPane.connectionStringCheckbox.label)}
                                </LabelWithTooltip>
                            </div>

                            <div className="notes">
                                <Text>
                                    {context.t(ResourceKeys.connectivityPane.notes)}
                                </Text>
                            </div>

                            <div className="connection-button">
                                <PrimaryButton
                                    onClick={this.onSaveConnectionInfoClick}
                                    disabled={!this.state.connectionString || !!error}
                                >
                                    {context.t(ResourceKeys.connectivityPane.saveButton.label)}
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                )}
            </LocalizationContextConsumer>

        );
    }

    private readonly onConnectionStringChanged = (connectionString: string)  => {
        const error = validateConnectionString(connectionString);
        this.setState({
            connectionString,
            error,
        });
    }

    private readonly onSaveConnectionInfoClick = (): void => {
        this.props.saveConnectionInfo({...this.state});
        this.props.history.push('/devices');
    }

    private readonly onCheckboxChange = (ev: React.FormEvent<HTMLElement>, isChecked: boolean) => {
        this.setState({
            rememberConnectionString: isChecked,
        });
    }
}
