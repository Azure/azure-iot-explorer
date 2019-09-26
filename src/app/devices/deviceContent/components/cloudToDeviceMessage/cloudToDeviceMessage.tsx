/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { DetailsList, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { ISelection, Selection } from 'office-ui-fabric-react/lib/Selection';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { CLOUD_TO_DEVICE_MESSAGE, GroupedList, ArrayOperation, ITEM, CIRCLE_ADD, CIRCLE_ADD_SOLID } from '../../../../constants/iconNames';
import LabelWithTooltip from '../../../../shared/components/labelWithTooltip';
import { CloudToDeviceMessageParameters } from '../../../../api/parameters/deviceParameters';
import '../../../../css/_deviceDetail.scss';

interface PropertyItem {
    isSystemProperty: boolean;
    index: number;
    keyName: string;
    value: string;
}

export const systemPropertyKeyNames = ['message-id', 'correlation-id', 'content-type', 'content-encoding'];

export interface CloudToDeviceMessageState {
    addTimestamp: boolean;
    body: string;
    propertiesSectionCollapsed: boolean;
    properties: PropertyItem[];
    selectedIndices: Set<number>;
    selection: ISelection;
}

export interface CloudToDeviceMessageProps {
    connectionString: string;
    onSendCloudToDeviceMessage: (parameters: CloudToDeviceMessageParameters) => void;
}

export default class CloudToDeviceMessage extends React.Component<CloudToDeviceMessageProps & RouteComponentProps, CloudToDeviceMessageState> {

    constructor(props: CloudToDeviceMessageProps & RouteComponentProps) {
        super(props);
        this.state = {
            addTimestamp: false,
            body: '',
            properties: [{index: 0, keyName: '', isSystemProperty: false, value: ''}],
            propertiesSectionCollapsed: false,
            selectedIndices: new Set(),
            selection: new Selection({ onSelectionChanged: this.onSelectionChanged })
        };
    }

    public render(): JSX.Element {
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <>
                        {this.showCommandBar(context)}
                        <h3>{context.t(ResourceKeys.cloudToDeviceMessage.headerText)}</h3>
                        <div className="device-detail">
                            {this.renderMessageBodySection(context)}
                            {this.renderPropertiesSection(context)}
                        </div>
                    </>
                )}
            </LocalizationContextConsumer>
        );
    }

    private readonly showCommandBar = (context: LocalizationContextInterface) => {
        // if properties has duplicate keys excluding white space, disable send message button
        const filteredPropertyKeyNames = this.state.properties.filter(property => property.keyName !== '').map(property => property.keyName);
        const disabled = filteredPropertyKeyNames.length !== new Set(filteredPropertyKeyNames).size;
        return (
            <CommandBar
                className="command"
                items={[
                    {
                        ariaLabel: context.t(ResourceKeys.cloudToDeviceMessage.sendMessageButtonText),
                        disabled,
                        iconProps: {iconName: CLOUD_TO_DEVICE_MESSAGE},
                        key: CLOUD_TO_DEVICE_MESSAGE,
                        name: context.t(ResourceKeys.cloudToDeviceMessage.sendMessageButtonText),
                        onClick: this.onSendMessageClick
                    }
                ]}
            />
        );
    }

    private readonly renderMessageBodySection = (context: LocalizationContextInterface) => {
        const textFieldRows = 5;
        return (
            <>
                <LabelWithTooltip
                    tooltipText={context.t(ResourceKeys.cloudToDeviceMessage.bodyTooltip)}
                >
                    {context.t(ResourceKeys.cloudToDeviceMessage.body)}
                </LabelWithTooltip>
                <div className="cloud-to-device-message-text-field">
                    <TextField className="cloud-to-device-message-text-field" multiline={true} rows={textFieldRows} onChange={this.onTextFieldChange}/>
                </div>
                <Checkbox
                    label={context.t(ResourceKeys.cloudToDeviceMessage.addTimestamp)}
                    ariaLabel={context.t(ResourceKeys.cloudToDeviceMessage.addTimestamp)}
                    onChange={this.onCheckboxChange}
                />
            </>
        );
    }

    private readonly renderPropertiesSection = (context: LocalizationContextInterface) => {
        return (
            <div className="properties-section">
                <IconButton
                    className="properties-section-icon"
                    iconProps={{iconName: this.state.propertiesSectionCollapsed ? GroupedList.OPEN : GroupedList.CLOSE}}
                    ariaLabel={this.state.propertiesSectionCollapsed ?
                        context.t(ResourceKeys.cloudToDeviceMessage.properties.collapse.open) :
                        context.t(ResourceKeys.cloudToDeviceMessage.properties.collapse.close)}
                    onClick={this.toggleCollapse}
                    title={context.t(this.state.propertiesSectionCollapsed ? ResourceKeys.cloudToDeviceMessage.properties.collapse.open : ResourceKeys.cloudToDeviceMessage.properties.collapse.close)}
                />
                <LabelWithTooltip
                    tooltipText={context.t(ResourceKeys.cloudToDeviceMessage.properties.tooltip)}
                >
                    {context.t(ResourceKeys.cloudToDeviceMessage.properties.customProperties)}
                </LabelWithTooltip>
                {!this.state.propertiesSectionCollapsed && this.renderPropertiesList(context)}
            </div>
        );
    }

    private readonly renderPropertiesList = (context: LocalizationContextInterface) => {
        const columns: IColumn[] = [
            {
                isResizable: true,
                key: context.t(ResourceKeys.cloudToDeviceMessage.properties.key),
                maxWidth: 200,
                minWidth: 150,
                name: context.t(ResourceKeys.cloudToDeviceMessage.properties.key),
                onRender: (item: PropertyItem ) => {
                if (item.isSystemProperty) {
                    return (
                        <Label aria-label={context.t(ResourceKeys.cloudToDeviceMessage.properties.key)}>
                            {item.keyName}
                        </Label>
                    );
                }
                else {
                    const hasDuplicateKey = (keyName: string) => keyName && this.state.properties.filter(property => property.keyName === keyName).length > 1;
                    return (
                        <TextField
                            ariaLabel={context.t(ResourceKeys.cloudToDeviceMessage.properties.key)}
                            errorMessage={hasDuplicateKey(item.keyName) ? context.t(ResourceKeys.cloudToDeviceMessage.properties.keyDup) : ''}
                            value={item.keyName}
                            onChange={this.handleEditCustomPropertyKey(item)}
                        />);
                    }
                }
            },
            {
                isResizable: true,
                key: context.t(ResourceKeys.cloudToDeviceMessage.properties.value),
                maxWidth: 200,
                minWidth: 150,
                name: context.t(ResourceKeys.cloudToDeviceMessage.properties.value),
                onRender: (item: PropertyItem ) => {
                return (
                    <TextField
                        ariaLabel={context.t(ResourceKeys.cloudToDeviceMessage.properties.value)}
                        value={item.value}
                        onChange={this.handleEditPropertyValue(item)}
                    />);
                }
            },
        ];

        const systemPropertySubMenuProps: IContextualMenuItem[] = systemPropertyKeyNames.map(keyName =>
            ({
                disabled: this.state.properties.some(property => property.keyName === keyName),
                iconProps: {
                    iconName: ITEM
                },
                key: keyName,
                name: keyName,
                onClick: this.handleAddSystemProperty(keyName),
            })
        );

        return (
            <>
                <CommandBar
                    className="properties-section-command-bar"
                    items={[
                        {
                            ariaLabel: context.t(ResourceKeys.cloudToDeviceMessage.properties.addCustomProperty),
                            iconProps: {
                                iconName: CIRCLE_ADD
                            },
                            key: context.t(ResourceKeys.cloudToDeviceMessage.properties.addCustomProperty),
                            name: context.t(ResourceKeys.cloudToDeviceMessage.properties.addCustomProperty),
                            onClick: this.handleAddCustomProperty
                        },
                        {
                            ariaLabel: context.t(ResourceKeys.cloudToDeviceMessage.properties.addSystemProperty),
                            iconProps: {
                                iconName: CIRCLE_ADD_SOLID
                            },
                            key: context.t(ResourceKeys.cloudToDeviceMessage.properties.addSystemProperty),
                            name: context.t(ResourceKeys.cloudToDeviceMessage.properties.addSystemProperty),
                            subMenuProps: {
                                items: systemPropertySubMenuProps
                            }
                        },
                        {
                            ariaLabel: context.t(ResourceKeys.cloudToDeviceMessage.properties.delete),
                            disabled: this.state.selectedIndices.size === 0,
                            iconProps: {
                                iconName: ArrayOperation.REMOVE
                            },
                            key: context.t(ResourceKeys.cloudToDeviceMessage.properties.delete),
                            name: context.t(ResourceKeys.cloudToDeviceMessage.properties.delete),
                            onClick: this.handleDelete
                        },
                    ]}
                />
                <MarqueeSelection selection={this.state.selection}>
                    <DetailsList
                        items={this.state.properties}
                        columns={columns}
                        ariaLabelForSelectionColumn={context.t(ResourceKeys.cloudToDeviceMessage.properties.toggleSelectionColumnAriaLabel)}
                        ariaLabelForSelectAllCheckbox={context.t(ResourceKeys.cloudToDeviceMessage.properties.selectAllCheckboxAriaLabel)}
                        checkButtonAriaLabel={context.t(ResourceKeys.cloudToDeviceMessage.properties.rowCheckBoxAriaLabel)}
                        selection={this.state.selection}
                    />
                </MarqueeSelection>
            </>
        );
    }

    private readonly onSelectionChanged = () => {
        this.setState({
            selectedIndices: new Set(this.state.selection.getSelectedIndices())
        });
    }

    private readonly handleAddCustomProperty = () => {
        this.setState(prevState => ({
            properties: [...prevState.properties, {isSystemProperty: false, index: prevState.properties.length + 1, keyName: '', value: ''}]
        }));
    }

    private readonly handleAddSystemProperty = (keyName: string) => () => {
        this.setState(prevState => ({
            properties: [...prevState.properties, {isSystemProperty: true,  index: prevState.properties.length + 1, keyName, value: ''}]
        }));
    }

    private readonly handleEditCustomPropertyKey = (property: PropertyItem) => ((event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        const items = this.state.properties;
        items.forEach((element, index) => {
            if (element.index === property.index) {
                items[index] = {...items[index], keyName: newValue};
            }
        });
        this.setState({properties: items});
    })

    private readonly handleEditPropertyValue = (property: PropertyItem) => ((event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        const items = this.state.properties;
        items.forEach((element, index) => {
            if (element.index === property.index) {
                items[index] = {...items[index], value: newValue};
            }
        });
        this.setState({properties: items});
    })

    private readonly handleDelete = () => {
        const updatedProperties = [];
        for (let i = 0; i < this.state.properties.length; i++) {
            if (!this.state.selectedIndices.has(i)) {
                updatedProperties.push(this.state.properties[i]);
            }
        }
        this.setState({properties: updatedProperties});
    }

    private readonly onTextFieldChange = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newText: string) => {
        this.setState({
            body: newText
        });
    }

    private readonly onCheckboxChange = (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        this.setState({
            addTimestamp: checked
        });
    }

    private readonly toggleCollapse = () => {
        this.setState({
            propertiesSectionCollapsed: !this.state.propertiesSectionCollapsed
        });
    }

    // tslint:disable-next-line:cyclomatic-complexity
    private readonly onSendMessageClick = () => {
        const properties = [];
        for (const property of this.state.properties) {
            if (property.keyName && property.value) {
                properties.push({key: property.keyName, value: property.value});
            }
        }

        this.props.onSendCloudToDeviceMessage({
            body: this.state.addTimestamp && this.state.body ? `${new Date().toLocaleString()} - ${this.state.body}` : this.state.addTimestamp && new Date().toLocaleString() || this.state.body,
            connectionString: this.props.connectionString,
            deviceId: getDeviceIdFromQueryString(this.props),
            properties: properties === [] ? undefined : properties
        });
    }
}
