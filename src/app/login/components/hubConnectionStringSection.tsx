/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { TranslationFunction } from 'i18next';
import { IconButton, IButton } from 'office-ui-fabric-react/lib/Button';
import { ComboBox, IComboBoxOption, IComboBox } from 'office-ui-fabric-react/lib/ComboBox';
import { Stack } from 'office-ui-fabric-react';
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { getConnectionInfoFromConnectionString } from '../../api/shared/utils';
import { COPY, REMOVE } from '../../constants/iconNames';
import { Notification, NotificationType } from '../../api/models/notification';
import '../../css/_connectivityPane.scss';

export interface HubConnectionStringSectionDataProps {
    connectionString: string;
    connectionStringError?: string;
    connectionStringList: string[];
}

export interface HubConnectionStringSectionActionProps {
    onChangeConnectionString: (connectionString: string, newString?: boolean) => void;
    onRemoveConnectionString: (connectionString: string) => void;
    addNotification: (notification: Notification) => void;
}

export default class HubConnectionStringSection extends React.Component<HubConnectionStringSectionDataProps & HubConnectionStringSectionActionProps> {
    constructor(props: HubConnectionStringSectionDataProps & HubConnectionStringSectionActionProps) {
        super(props);
    }

    private readonly hiddenInputRef = React.createRef<HTMLInputElement>();
    private readonly copyButtonRef = React.createRef<IButton>();

    public render(): JSX.Element {
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    this.renderConnectionStringList(context.t)
                )}
            </LocalizationContextConsumer>
        );
    }

    private readonly getComboBoxOptionText = (item: string) => {
        const info = getConnectionInfoFromConnectionString(item);
        return `HostName=${info.hostName}; SharedAccessKeyName=${info.sharedAccessKeyName}`;
    }
    private readonly getComboBoxOption = (item: string, t: TranslationFunction) => {
        const info = getConnectionInfoFromConnectionString(item);

        return {
            ariaLabel: t(ResourceKeys.connectivityPane.connectionStringComboBox.item.ariaLabel, {hostName: info.hostName, sharedAccessKeyName: info.sharedAccessKeyName}),
            key: item,
            text: this.getComboBoxOptionText(item)
        };
    }
    private readonly renderConnectionStringList = (t: TranslationFunction) => {
        const { connectionString, connectionStringError, connectionStringList } = this.props;
        const hostName = getConnectionInfoFromConnectionString(this.props.connectionString).hostName;
        const options: IComboBoxOption[] = connectionStringList.map(item => this.getComboBoxOption(item, t));
        const removeClick = () => this.props.onRemoveConnectionString(this.props.connectionString);

        return (
            <Stack horizontal={true}>
                <Stack.Item align="start">
                    <ComboBox
                        allowFreeform={true}
                        autoComplete={'on'}
                        className="connection-string-dropDown"
                        label={t(ResourceKeys.connectivityPane.connectionStringComboBox.label)}
                        ariaLabel={t(ResourceKeys.connectivityPane.connectionStringComboBox.ariaLabel)}
                        options={options}
                        text={connectionString}
                        onChange={this.onConnectionStringChanged}
                        placeholder={t(ResourceKeys.connectivityPane.connectionStringComboBox.prompt)}
                        errorMessage={t(connectionStringError)}
                        useComboBoxAsMenuWidth={true}
                    />
                    <input
                        aria-hidden={true}
                        className="hidden"
                        tabIndex={-1}
                        ref={this.hiddenInputRef}
                        value={this.props.connectionString}
                        readOnly={true}
                    />
                </Stack.Item>
                <Stack.Item align="end" className="connection-string-button">
                    <TooltipHost
                        content={t(ResourceKeys.connectivityPane.connectionStringComboBox.ariaLabelRemove, {hostName})}
                    >
                        <IconButton
                            iconProps={{ iconName: REMOVE }}
                            ariaLabel={t(ResourceKeys.connectivityPane.connectionStringComboBox.ariaLabelRemove, {hostName})}
                            disabled={!this.props.connectionString || this.props.connectionString === ''}
                            onClick={removeClick}
                        />
                    </TooltipHost>
                </Stack.Item>
                <Stack.Item align="end" className="connection-string-button">
                    <TooltipHost
                        content={t(ResourceKeys.connectivityPane.dropDown.copyButton)}
                    >
                        <IconButton
                            iconProps={{ iconName: COPY }}
                            ariaLabel={t(ResourceKeys.connectivityPane.dropDown.copyButton)}
                            disabled={!this.props.connectionString || this.props.connectionString === ''}
                            onClick={this.copyToClipboard}
                            componentRef={this.copyButtonRef}
                        />
                    </TooltipHost>
                </Stack.Item>
            </Stack>
        );
    }

    private readonly onConnectionStringChanged = (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
        if (option) {
            this.props.onChangeConnectionString(option.key as string);
        } else {
            const duplicate = this.props.connectionStringList.indexOf(value) >= 0;
            this.props.onChangeConnectionString(value, !duplicate);
        }
    }

    public copyToClipboard = () => {
        const node = this.hiddenInputRef.current;
        if (node) {
            node.select();
            document.execCommand('copy');

            // set focus back to copy button
            const copyButtonNode = this.copyButtonRef.current;
            if (copyButtonNode) {
                copyButtonNode.focus();
            }

            // add notification
            this.props.addNotification({
                text: {
                    translationKey: ResourceKeys.notifications.copiedToClipboard
                },
                type: NotificationType.info
            });
        }
    }
}
