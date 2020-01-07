/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { DetailsList, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { ISelection, Selection } from 'office-ui-fabric-react/lib/Selection';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { CLOUD_TO_DEVICE_MESSAGE, ArrayOperation, ITEM, CIRCLE_ADD, CIRCLE_ADD_SOLID } from '../../../../constants/iconNames';
import LabelWithTooltip from '../../../../shared/components/labelWithTooltip';
import { CloudToDeviceMessageActionParameters } from '../../actions';
import CollapsibleSection from '../../../../shared/components/collapsibleSection';
import { MEDIUM_COLUMN_WIDTH } from '../../../../constants/columnWidth';
import '../../../../css/_deviceDetail.scss';

interface PropertyItem {
    isSystemProperty: boolean;
    index: number;
    keyName: string;
    value: string;
}

export enum SystemProperties {
    ACK = 'ack',
    CONTENT_TYPE = 'contentType',
    CONTENT_ENCODING = 'contentEncoding',
    CORRELATION_ID = 'correlationId',
    EXPIRY_TIME_UTC = 'expiryTimeUtc',
    LOCK_TOKEN = 'lockToken',
    MESSAGE_ID = 'messageId'
}

export const systemPropertyKeyNameMappings: Array<{keyName: string, displayName: string, secondaryText: string}> =
    Object.values(SystemProperties).map(property => ({
        displayName: (ResourceKeys.cloudToDeviceMessage.properties.systemProperties as any)[property].displayName, // tslint:disable-line:no-any
        keyName: property,
        secondaryText: (ResourceKeys.cloudToDeviceMessage.properties.systemProperties as any)[property].description // tslint:disable-line:no-any
    }));

export interface CloudToDeviceMessageState {
    addTimestamp: boolean;
    body: string;
    properties: PropertyItem[];
    propertyIndex: number;
    selectedIndices: Set<number>;
    selection: ISelection;
    showExpiryError: boolean;
}

export interface CloudToDeviceMessageProps {
    onSendCloudToDeviceMessage: (parameters: CloudToDeviceMessageActionParameters) => void;
}

export default class CloudToDeviceMessage extends React.Component<CloudToDeviceMessageProps & RouteComponentProps, CloudToDeviceMessageState> {

    constructor(props: CloudToDeviceMessageProps & RouteComponentProps) {
        super(props);
        this.state = {
            addTimestamp: false,
            body: '',
            properties: [{index: 0, keyName: '', isSystemProperty: false, value: ''}],
            propertyIndex: 0,
            selectedIndices: new Set(),
            selection: new Selection({ onSelectionChanged: this.onSelectionChanged }),
            showExpiryError: false
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
        const disabled = filteredPropertyKeyNames.length !== new Set(filteredPropertyKeyNames).size || this.state.showExpiryError;
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
                    styles={
                        {
                            root: {
                                marginBottom: 20
                            }
                        }
                    }
                />
            </>
        );
    }

    private readonly renderPropertiesSection = (context: LocalizationContextInterface) => {
        return (
            <CollapsibleSection
                expanded={true}
                label={context.t(ResourceKeys.cloudToDeviceMessage.properties.label)}
                tooltipText={context.t(ResourceKeys.cloudToDeviceMessage.properties.tooltip)}
            >
                {this.renderPropertiesList(context)}
            </CollapsibleSection>
        );
    }

    private readonly getColumns = (context: LocalizationContextInterface): IColumn[] => {
        return [
            {
                isResizable: true,
                key: 'key',
                maxWidth: MEDIUM_COLUMN_WIDTH,
                minWidth: 150,
                name: context.t(ResourceKeys.cloudToDeviceMessage.properties.key),
            },
            {
                isResizable: true,
                key: 'value',
                minWidth: 150,
                name: context.t(ResourceKeys.cloudToDeviceMessage.properties.value),
            }
        ];
    }

    private readonly renderItemColumn = (context: LocalizationContextInterface) => (item: PropertyItem, index: number, column: IColumn) => {
        switch (column.key) {
            case 'key':
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
                            errorMessage={hasDuplicateKey(item.keyName) && context.t(ResourceKeys.cloudToDeviceMessage.properties.keyDup)}
                            value={item.keyName}
                            onChange={this.handleEditCustomPropertyKey(item)}
                        />);
                }
            case 'value':
                return this.renderItemValueColumn(context, item, column);
            default:
                return;
        }
    }

    private readonly renderItemValueColumn = (context: LocalizationContextInterface, item: PropertyItem, column: IColumn) => {
        if (item.keyName === SystemProperties.ACK) {
            return this.renderAckDropdown(context, item);
        }
        if (item.keyName === SystemProperties.CONTENT_ENCODING) {
            return this.renderEncodingDropdown(context, item);
        }
        if (item.keyName === SystemProperties.EXPIRY_TIME_UTC) {
            return (
                <TextField
                    ariaLabel={context.t(ResourceKeys.cloudToDeviceMessage.properties.key)}
                    errorMessage={this.state.showExpiryError && context.t(ResourceKeys.cloudToDeviceMessage.properties.systemProperties.expiryTimeUtc.error)}
                    value={item.value}
                    onChange={this.handleEditExpiryTime(item)}
                />);
        }
        else {
            return (
                <TextField
                    ariaLabel={context.t(ResourceKeys.cloudToDeviceMessage.properties.value)}
                    value={item.value}
                    onChange={this.handleEditPropertyValue(item)}
                />);
        }
    }

    private readonly renderAckDropdown = (context: LocalizationContextInterface, property: PropertyItem) => {
        const options: IDropdownOption[] = [
            {
                key: 'full',
                text: context.t(ResourceKeys.cloudToDeviceMessage.properties.systemProperties.ack.full)
            },
            {
                key: 'positive',
                text: context.t(ResourceKeys.cloudToDeviceMessage.properties.systemProperties.ack.positive)
            },
            {
                key: 'negative',
                text: context.t(ResourceKeys.cloudToDeviceMessage.properties.systemProperties.ack.negative)
            }
        ];
        return (
            <Dropdown
                options={options}
                onChange={this.onDropdownSelectedKeyChanged(property)}
            />);
    }

    private readonly renderEncodingDropdown = (context: LocalizationContextInterface, property: PropertyItem) => {
        const options: IDropdownOption[] = [
            {
                key: 'utf-8',
                text: context.t(ResourceKeys.cloudToDeviceMessage.properties.systemProperties.contentEncoding.utf8)
            },
            {
                key:  'utf-16',
                text: context.t(ResourceKeys.cloudToDeviceMessage.properties.systemProperties.contentEncoding.utf16)
            },
            {
                key:  'utf-32',
                text: context.t(ResourceKeys.cloudToDeviceMessage.properties.systemProperties.contentEncoding.utf32)
            }
        ];
        return (
            <Dropdown
                options={options}
                onChange={this.onDropdownSelectedKeyChanged(property)}
            />);
    }

    private readonly renderPropertiesList = (context: LocalizationContextInterface) => {
        const systemPropertySubMenuProps: IContextualMenuItem[] = systemPropertyKeyNameMappings.map(keyNameMap =>
            ({
                disabled: this.state.properties.some(property => property.keyName === keyNameMap.keyName),
                iconProps: {
                    iconName: ITEM
                },
                key: keyNameMap.keyName,
                name: context.t(keyNameMap.displayName),
                onClick: this.handleAddSystemProperty(keyNameMap.keyName),
                secondaryText: context.t(keyNameMap.secondaryText)
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
                        columns={this.getColumns(context)}
                        onRenderItemColumn={this.renderItemColumn(context)}
                        ariaLabelForSelectionColumn={context.t(ResourceKeys.cloudToDeviceMessage.properties.toggleSelectionColumnAriaLabel)}
                        ariaLabelForSelectAllCheckbox={context.t(ResourceKeys.cloudToDeviceMessage.properties.selectAllCheckboxAriaLabel)}
                        checkButtonAriaLabel={context.t(ResourceKeys.cloudToDeviceMessage.properties.rowCheckBoxAriaLabel)}
                        selection={this.state.selection}
                    />
                </MarqueeSelection>
            </>
        );
    }

    private readonly onDropdownSelectedKeyChanged = (property: PropertyItem) => (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption): void => {
        const items = this.state.properties;
        const index = this.findMatchingItemIndex(property);
        items[index] = {...items[index], value: option.key.toString()};
        this.setState({properties: items});
    }

    private readonly onSelectionChanged = () => {
        this.setState({
            selectedIndices: new Set(this.state.selection.getSelectedIndices())
        });
    }

    private readonly handleAddCustomProperty = () => {
        const newIndex = this.state.propertyIndex + 1;
        this.setState(prevState => ({
            properties: [...prevState.properties, {isSystemProperty: false, index: newIndex, keyName: '', value: ''}],
            propertyIndex: newIndex
        }));
    }

    private readonly handleAddSystemProperty = (keyName: string) => () => {
        const newIndex = this.state.propertyIndex + 1;
        this.setState(prevState => ({
            properties: [...prevState.properties, {isSystemProperty: true,  index: newIndex, keyName, value: ''}],
            propertyIndex: newIndex
        }));
    }

    private readonly handleEditCustomPropertyKey = (property: PropertyItem) => ((event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        const items = this.state.properties;
        const index = this.findMatchingItemIndex(property);
        items[index] = {...items[index], keyName: newValue};
        this.setState({properties: items});
    })

    private readonly handleEditPropertyValue = (property: PropertyItem) => ((event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        const items = this.state.properties;
        const index = this.findMatchingItemIndex(property);
        items[index] = {...items[index], value: newValue};
        this.setState({properties: items});
    })

    private readonly handleEditExpiryTime = (property: PropertyItem) => ((event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        const items = this.state.properties;
        const index = this.findMatchingItemIndex(property);
        items[index] = {...items[index], value: newValue};
        if (!parseInt(newValue) || moment.utc(parseInt(newValue)) <= moment.utc()) { // tslint:disable-line:radix
            this.setState({showExpiryError: true});
        }
        else {
            this.setState({showExpiryError: false});
        }
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

    private readonly onSendMessageClick = () => {
        const properties = this.state.properties
            .filter(property => property.keyName && property.value)
            .map(property => ({key: property.keyName, value: property.value, isSystemProperty: property.isSystemProperty}));

        if (!properties.some(property => property.key === SystemProperties.MESSAGE_ID)) {
            // populate a random message id
            properties.push({key: SystemProperties.MESSAGE_ID, value: uuid(), isSystemProperty: true});
        }

        const timeStamp = new Date().toLocaleString();
        this.props.onSendCloudToDeviceMessage({
            body: this.state.addTimestamp && this.state.body ? `${timeStamp} - ${this.state.body}` : (this.state.addTimestamp ? timeStamp : this.state.body),
            deviceId: getDeviceIdFromQueryString(this.props),
            properties
        });
    }

    private readonly findMatchingItemIndex = (property: PropertyItem): number => {
        const items = this.state.properties;
        let indexFound = -1;
        items.forEach((element, index) => {
            if (element.index === property.index) {
                indexFound = index;
            }
        });
        return indexFound;
    }
}
