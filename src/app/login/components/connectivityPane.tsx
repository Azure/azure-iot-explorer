/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Text } from 'office-ui-fabric-react/lib/Text';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { generateConnectionStringValidationError, formatConnectionStrings } from '../../shared/utils/hubConnectionStringHelper';
import HubConnectionStringSection from './hubConnectionStringSection';
import AppVersionMessageBar from './appVersionMessageBar';
import { Notification } from '../../api/models/notification';
import { getConnectionInfoFromConnectionString } from '../../api/shared/utils';
import { SetActiveAzureResourceByConnectionStringActionParameters } from '../../azureResource/actions';
import { ROUTE_PARTS } from '../../constants/routes';
import '../../css/_connectivityPane.scss';

export interface ConnectivityPaneDispatchProps {
    setActiveAzureResource: (parameters: SetActiveAzureResourceByConnectionStringActionParameters) => void;
    setConnectionStrings: (connectionStrings: string[]) => void;
    addNotification: (notification: Notification) => void;
}

export interface ConnectivityPaneDataProps {
    connectionString: string;
    connectionStringList: string[];
}

export interface ConnectivityState {
    connectionString: string;
    connectionStringError: string;
    connectionStringList: string[];
}

export default class ConnectivityPane extends React.Component<RouteComponentProps & ConnectivityPaneDataProps & ConnectivityPaneDispatchProps, ConnectivityState> {
    constructor(props: RouteComponentProps & ConnectivityPaneDataProps & ConnectivityPaneDispatchProps) {
        super(props);

        const selectedConnectionString = this.props.connectionString ||
            (this.props.connectionStringList && this.props.connectionStringList.length > 0 && this.props.connectionStringList[0]) || '';

        this.state = {
            connectionString: selectedConnectionString,
            connectionStringError: '',
            connectionStringList: this.props.connectionStringList,
        };
    }

    public render(): JSX.Element {
        const { connectionStringError } = this.state;

        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <div className="connectivity-pane" role="main">

                        <div className="main" role="dialog">
                            <h1>
                                {context.t(ResourceKeys.connectivityPane.header)}
                            </h1>

                            <HubConnectionStringSection
                                addNotification={this.props.addNotification}
                                connectionString={this.state.connectionString}
                                connectionStringError={this.state.connectionStringError}
                                connectionStringList={this.state.connectionStringList}
                                onChangeConnectionString={this.onChangeConnectionString}
                                onRemoveConnectionString={this.onRemoveConnectionString}
                            />
                            <div className="notes">
                                <Text>
                                    {context.t(ResourceKeys.connectivityPane.notes)}
                                </Text>
                            </div>
                            <div className="connection-button">
                                <PrimaryButton
                                    onClick={this.onSaveConnectionInfoClick}
                                    disabled={!this.state.connectionString || !!connectionStringError}
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

    private readonly onChangeConnectionString = (connectionString: string, newString?: boolean) => {
        const connectionStringError = generateConnectionStringValidationError(connectionString);
        const connectionStringList = newString && !connectionStringError ? [connectionString, ...this.state.connectionStringList] : this.state.connectionStringList;

        this.setState({
            connectionString,
            connectionStringError,
            connectionStringList
        });
    }

    private readonly onRemoveConnectionString = (connectionStringToRemove: string) => {
        const connectionStringList = this.state.connectionStringList.filter(s => s !== connectionStringToRemove);
        const connectionString = connectionStringList.length > 0 ? connectionStringList[0] : '';
        const connectionStringError = generateConnectionStringValidationError(connectionString);

        this.setState({
            connectionString,
            connectionStringError,
            connectionStringList
        });
    }

    private readonly onSaveConnectionInfoClick = (): void => {
        const { hostName } = getConnectionInfoFromConnectionString(this.state.connectionString);
        const connectionStrings = formatConnectionStrings(this.state.connectionStringList, this.state.connectionString);
        this.props.setConnectionStrings(connectionStrings);
        this.props.setActiveAzureResource({
            connectionString: this.state.connectionString,
            hostName
        });
        this.props.history.push(`${ROUTE_PARTS.RESOURCE}/${hostName}/${ROUTE_PARTS.DEVICES}`);
    }
}
