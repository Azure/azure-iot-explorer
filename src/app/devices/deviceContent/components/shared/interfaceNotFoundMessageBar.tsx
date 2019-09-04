/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { MessageBarButton } from 'office-ui-fabric-react/lib/Button';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import '../../../../css/_interfaceNotFoundMessageBar.scss';

export interface InterfaceNotFoundMessageBoxProps {
    settingsVisibleToggle: (visible: boolean) => void;
}

export default class InterfaceNotFoundMessageBox extends React.Component<InterfaceNotFoundMessageBoxProps> {

    public render() {
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <>
                    <MessageBar
                        messageBarType={MessageBarType.error}
                        actions={
                            <MessageBarButton
                                className="configure-button"
                                onClick={this.handleConfigure}
                            >
                                    {context.t(ResourceKeys.deviceInterfaces.command.configure)}
                            </MessageBarButton>}
                    >
                        {context.t(ResourceKeys.notifications.getInterfaceModelOnError)}
                    </MessageBar>
                    </>
                )}
            </LocalizationContextConsumer>
        );
    }

    private readonly handleConfigure = () => {
        this.props.settingsVisibleToggle(true);
}
}
