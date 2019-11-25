/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { TranslationFunction } from 'i18next';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { IconButton, IButton } from 'office-ui-fabric-react/lib/Button';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Stack } from 'office-ui-fabric-react';
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip';
import { getId } from 'office-ui-fabric-react/lib/Utilities';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../localization/resourceKeys';
import MaskedCopyableTextFieldContainer from '../../shared/components/maskedCopyableTextFieldContainer';
import LabelWithTooltip from '../../shared/components/labelWithTooltip';
import { getConnectionInfoFromConnectionString } from '../../api/shared/utils';
import { COPY } from '../../constants/iconNames';
import { Notification, NotificationType } from '../../api/models/notification';
import '../../css/_connectivityPane.scss';

export const addNewConnectionStringKey = 'Add';
export interface HubConnectionStringSectionDataProps {
    connectionString: string;
    connectionStringList: string[];
    rememberConnectionString: boolean;
    error: string;
}

export interface HubConnectionStringSectionActionProps {
    onConnectionStringChangedFromTextField: (connectionString: string) => void;
    onConnectionStringChangedFromDropdown: (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption) => void;
    onCheckboxChange: (ev: React.FormEvent<HTMLElement>, isChecked: boolean) => void;
    addNotification: (notification: Notification) => void;
}

export interface HubConnectionStringSectionState {
    newConnectionString: string;
    showAddNewConnectionStringTextField: boolean;
}

export default class HubConnectionStringSection extends React.Component<HubConnectionStringSectionDataProps & HubConnectionStringSectionActionProps, HubConnectionStringSectionState> {
    constructor(props: HubConnectionStringSectionDataProps & HubConnectionStringSectionActionProps) {
        super(props);

        this.state = {
            newConnectionString: '',
            showAddNewConnectionStringTextField: false
        };
    }

    private hiddenInputRef = React.createRef<HTMLInputElement>();
    private copyButtonRef = React.createRef<IButton>();
    private copyButtonTooltipHostId = getId('copyButtonTooltipHost');

    public render(): JSX.Element {
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <>
                        {!this.props.connectionStringList ? this.renderAddNewConnectionStringTextField(context.t) :
                             this.state.showAddNewConnectionStringTextField ?
                                this.renderAddNewConnectionStringTextField(context.t) :
                                this.renderConnectionStringList(context.t)
                        }
                    </>
                )}
            </LocalizationContextConsumer>
        );
    }

    private readonly renderConnectionStringList = (t: TranslationFunction) => {
        const options: IDropdownOption[] = this.props.connectionStringList && this.props.connectionStringList.map(item => ({
            key: item,
            text: item.replace(getConnectionInfoFromConnectionString(item).sharedAccessKey, '*****') // only mask sharedAccessKey
            })
        );
        options.push({
            key: addNewConnectionStringKey,
            text: t(ResourceKeys.connectivityPane.dropDown.newEntry)
        });
        return (
            <>
                <Stack horizontal={true}>
                    <Stack.Item align="start" className="connection-string-dropDown">
                        <Dropdown
                            label={t(ResourceKeys.connectivityPane.connectionStringTextBox.label)}
                            ariaLabel={t(ResourceKeys.connectivityPane.connectionStringTextBox.label)}
                            defaultSelectedKey={this.props.connectionString}
                            onChange={this.onConnectionStringChangedFromDropdown}
                            options={options}
                        />
                        </Stack.Item>
                    <Stack.Item align="end">
                        <TooltipHost
                            content={t(ResourceKeys.connectivityPane.dropDown.copyButton)}
                            id={this.copyButtonTooltipHostId}
                        >
                            <IconButton
                                iconProps={{ iconName: COPY }}
                                aria-labelledby={this.copyButtonTooltipHostId}
                                onClick={this.copyToClipboard}
                                componentRef={this.copyButtonRef}
                            />
                        </TooltipHost>
                    </Stack.Item>
                </Stack>
                <input
                    aria-hidden={true}
                    className="hidden"
                    tabIndex={-1}
                    ref={this.hiddenInputRef}
                    value={this.props.connectionString}
                    readOnly={true}
                />
            </>
        );
    }

    private readonly renderAddNewConnectionStringTextField = (t: TranslationFunction) => {
        const { error } = this.props;
        return (
            <>
                <MaskedCopyableTextFieldContainer
                    setFocus={true}
                    ariaLabel={t(ResourceKeys.connectivityPane.connectionStringTextBox.label)}
                    label={t(ResourceKeys.connectivityPane.connectionStringTextBox.label)}
                    error={error}
                    value={this.state.newConnectionString}
                    allowMask={true}
                    onTextChange={this.onConnectionStringChangedFromTextField}
                    readOnly={false}
                    required={true}
                    t={t}
                    calloutContent={(
                        <div className="callout-wrapper">
                            <div className="content">
                                {t(ResourceKeys.settings.configuration.connectionString.sublabel)}
                            </div>
                            <div className="footer">
                                <Link
                                    href={t(ResourceKeys.settings.configuration.connectionString.link)}
                                    target="_blank"
                                >
                                    {t(ResourceKeys.settings.configuration.connectionString.link)}
                                </Link>
                            </div>
                        </div>
                    )}
                />
                <div className="remember-connection-string">
                    <Checkbox
                        ariaLabel={t(ResourceKeys.connectivityPane.connectionStringCheckbox.ariaLabel)}
                        onChange={this.props.onCheckboxChange}
                        checked={this.props.rememberConnectionString}
                    />
                    <LabelWithTooltip
                        tooltipText={t(ResourceKeys.connectivityPane.connectionStringCheckbox.tooltip)}
                    >
                        {t(ResourceKeys.connectivityPane.connectionStringCheckbox.label)}
                    </LabelWithTooltip>
                </div>
        </>
        );
    }

    private readonly onConnectionStringChangedFromDropdown = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption) => {
        this.setState({
            showAddNewConnectionStringTextField: item.key.toString() === addNewConnectionStringKey ? true : false
        });
        this.props.onConnectionStringChangedFromDropdown(event, item);
        if (item.key.toString() === addNewConnectionStringKey) {
            this.props.onConnectionStringChangedFromTextField('');
        }
    }

    private readonly onConnectionStringChangedFromTextField = (value: string) => {
        this.setState({
            newConnectionString: value
        });
        this.props.onConnectionStringChangedFromTextField(value);
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
