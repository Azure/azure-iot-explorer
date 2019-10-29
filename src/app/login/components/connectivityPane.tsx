/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Text } from 'office-ui-fabric-react/lib/Text';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { generateConnectionStringValidationError } from '../../shared/utils/hubConnectionStringHelper';
import { SetConnectionStringActionParameter } from '../actions';
import HubConnectionStringSection from './hubConnectionStringSection';
import AppVersionMessageBar from './appVersionMessageBar';
import '../../css/_connectivityPane.scss';

export interface ConnectivityPaneDispatchProps {
    saveConnectionInfo: (connectionStringSetting: SetConnectionStringActionParameter) => void;
}

export interface ConnectivityPaneDataProps {
    connectionString: string;
    connectionStringList: string[];
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
        const { connectionString, error, rememberConnectionString } = this.state;

        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <div className="connectivity-pane" role="main">

                        <div className="main" role="dialog">
                            <h1>
                                {context.t(ResourceKeys.connectivityPane.header)}
                            </h1>

                            <HubConnectionStringSection
                                connectionString={connectionString}
                                connectionStringList={this.props.connectionStringList}
                                rememberConnectionString={rememberConnectionString}
                                error={error && context.t(error)}
                                onConnectionStringChangedFromTextField={this.onConnectionStringChanged}
                                onConnectionStringChangedFromDropdown={this.onConnectionStringChangedFromDropdown}
                                onCheckboxChange={this.onCheckboxChange}
                            />
                            <div className="notes">
                                <Text>
                                    {context.t(ResourceKeys.connectivityPane.notes)}
                                </Text>
                            </div>
                            <div className="connection-button">
                                <PrimaryButton
                                    onClick={this.onSaveConnectionInfoClick}
                                    disabled={!connectionString || !!error}
                                >
                                    {context.t(ResourceKeys.connectivityPane.saveButton.label)}
                                </PrimaryButton>
                            </div>
                            <AppVersionMessageBar/>
                        </div>
                    </div>
                )}
            </LocalizationContextConsumer>

        );
    }

    private readonly onConnectionStringChanged = (connectionString: string)  => {
        const error = generateConnectionStringValidationError(connectionString);
        this.setState({
            connectionString,
            error,
        });
    }

    private readonly onConnectionStringChangedFromDropdown = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption) => {
        this.setState({
            connectionString: item.key.toString()
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
