/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useLocation } from 'react-router-dom';
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
import { useLocalizationContext } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { CLOUD_TO_DEVICE_MESSAGE, ArrayOperation, ITEM, CIRCLE_ADD, CIRCLE_ADD_SOLID } from '../../../../constants/iconNames';
import LabelWithTooltip from '../../../../shared/components/labelWithTooltip';
import { CloudToDeviceMessageActionParameters } from '../../actions';
import { CollapsibleSection } from '../../../../shared/components/collapsibleSection';
import { MEDIUM_COLUMN_WIDTH } from '../../../../constants/columnWidth';
import { HeaderView } from '../../../../shared/components/headerView';
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

export const CloudToDeviceMessage: React.FC<CloudToDeviceMessageProps> = (props: CloudToDeviceMessageProps) => {
    const { t } = useLocalizationContext();
    const { search } = useLocation();

    const [ properties, setProperties ] = React.useState([{index: 0, keyName: '', isSystemProperty: false, value: ''}]);
    const [ addTimestamp, setAddTimestamp ] = React.useState<boolean>(false);
    const [ body, setBody ] = React.useState<string>('');
    const [ propertyIndex, setPropertyIndex ] = React.useState<number>(0);
    const [ selectedIndices, setSelectedIndices ] = React.useState(new Set());
    const [ showExpiryError, setShowExpiryError ] = React.useState<boolean>(false);

    const selection = new Selection({
        onSelectionChanged: () => onSelectionChanged()
    });

    const showCommandBar = () => {
        // if properties has duplicate keys excluding white space, disable send message button
        const filteredPropertyKeyNames = properties.filter(property => property.keyName !== '').map(property => property.keyName);
        const disabled = filteredPropertyKeyNames.length !== new Set(filteredPropertyKeyNames).size || showExpiryError;
        return (
            <CommandBar
                className="command"
                items={[
                    {
                        ariaLabel: t(ResourceKeys.cloudToDeviceMessage.sendMessageButtonText),
                        disabled,
                        iconProps: {iconName: CLOUD_TO_DEVICE_MESSAGE},
                        key: CLOUD_TO_DEVICE_MESSAGE,
                        name: t(ResourceKeys.cloudToDeviceMessage.sendMessageButtonText),
                        onClick: onSendMessageClick
                    }
                ]}
            />
        );
    };

    const renderPropertiesSection = () => {
        return (
            <CollapsibleSection
                expanded={true}
                label={t(ResourceKeys.cloudToDeviceMessage.properties.label)}
                tooltipText={t(ResourceKeys.cloudToDeviceMessage.properties.tooltip)}
            >
                {renderPropertiesList()}
            </CollapsibleSection>
        );
    };

    const renderPropertiesList = () => {
        const systemPropertySubMenuProps: IContextualMenuItem[] = systemPropertyKeyNameMappings.map(keyNameMap =>
            ({
                disabled: properties.some(property => property.keyName === keyNameMap.keyName),
                iconProps: {
                    iconName: ITEM
                },
                key: keyNameMap.keyName,
                name: t(keyNameMap.displayName),
                onClick: handleAddSystemProperty(keyNameMap.keyName),
                secondaryText: t(keyNameMap.secondaryText)
            })
        );

        return (
            <>
                <CommandBar
                    className="properties-section-command-bar"
                    items={[
                        {
                            ariaLabel: t(ResourceKeys.cloudToDeviceMessage.properties.addCustomProperty),
                            iconProps: {
                                iconName: CIRCLE_ADD
                            },
                            key: t(ResourceKeys.cloudToDeviceMessage.properties.addCustomProperty),
                            name: t(ResourceKeys.cloudToDeviceMessage.properties.addCustomProperty),
                            onClick: handleAddCustomProperty
                        },
                        {
                            ariaLabel: t(ResourceKeys.cloudToDeviceMessage.properties.addSystemProperty),
                            iconProps: {
                                iconName: CIRCLE_ADD_SOLID
                            },
                            key: t(ResourceKeys.cloudToDeviceMessage.properties.addSystemProperty),
                            name: t(ResourceKeys.cloudToDeviceMessage.properties.addSystemProperty),
                            subMenuProps: {
                                items: systemPropertySubMenuProps
                            }
                        },
                        {
                            ariaLabel: t(ResourceKeys.cloudToDeviceMessage.properties.delete),
                            disabled: selectedIndices.size === 0,
                            iconProps: {
                                iconName: ArrayOperation.REMOVE
                            },
                            key: t(ResourceKeys.cloudToDeviceMessage.properties.delete),
                            name: t(ResourceKeys.cloudToDeviceMessage.properties.delete),
                            onClick: handleDelete
                        },
                    ]}
                />
                <MarqueeSelection selection={selection}>
                    <DetailsList
                        items={properties}
                        columns={getColumns()}
                        onRenderItemColumn={renderItemColumn()}
                        ariaLabelForSelectionColumn={t(ResourceKeys.cloudToDeviceMessage.properties.toggleSelectionColumnAriaLabel)}
                        ariaLabelForSelectAllCheckbox={t(ResourceKeys.cloudToDeviceMessage.properties.selectAllCheckboxAriaLabel)}
                        checkButtonAriaLabel={t(ResourceKeys.cloudToDeviceMessage.properties.rowCheckBoxAriaLabel)}
                        selection={selection}
                    />
                </MarqueeSelection>
            </>
        );
    };

    const getColumns = (): IColumn[] => {
        return [
            {
                isResizable: true,
                key: 'key',
                maxWidth: MEDIUM_COLUMN_WIDTH,
                minWidth: 150,
                name: t(ResourceKeys.cloudToDeviceMessage.properties.key),
            },
            {
                isResizable: true,
                key: 'value',
                minWidth: 150,
                name: t(ResourceKeys.cloudToDeviceMessage.properties.value),
            }
        ];
    };

    const onCheckboxChange = (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        setAddTimestamp(checked);
    };

    const renderMessageBodySection = () => {
        const textFieldRows = 5;
        return (
            <>
                <LabelWithTooltip
                    tooltipText={t(ResourceKeys.cloudToDeviceMessage.bodyTooltip)}
                >
                    {t(ResourceKeys.cloudToDeviceMessage.body)}
                </LabelWithTooltip>
                <div className="cloud-to-device-message-text-field">
                    <TextField className="cloud-to-device-message-text-field" multiline={true} rows={textFieldRows} onChange={onTextFieldChange}/>
                </div>
                <Checkbox
                    label={t(ResourceKeys.cloudToDeviceMessage.addTimestamp)}
                    ariaLabel={t(ResourceKeys.cloudToDeviceMessage.addTimestamp)}
                    onChange={onCheckboxChange}
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
    };

    const renderItemColumn = () => (item: PropertyItem, index: number, column: IColumn) => {
        const handleEditCustomPropertyKey = React.useCallback((event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            const items = [...properties];
            items[index] = {...items[index], keyName: newValue};
            setProperties(items);
        },                                                    [item]);

        switch (column.key) {
            case 'key':
                if (item.isSystemProperty) {
                    return (
                        <Label aria-label={t(ResourceKeys.cloudToDeviceMessage.properties.key)}>
                            {item.keyName}
                        </Label>
                    );
                }
                else {
                    const hasDuplicateKey = (keyName: string) => keyName && properties.filter(property => property.keyName === keyName).length > 1;
                    return (
                        <TextField
                            ariaLabel={t(ResourceKeys.cloudToDeviceMessage.properties.key)}
                            errorMessage={hasDuplicateKey(item.keyName) && t(ResourceKeys.cloudToDeviceMessage.properties.keyDup)}
                            value={item.keyName}
                            onChange={handleEditCustomPropertyKey}
                        />);
                }
            case 'value':
                return renderItemValueColumn(item, column);
            default:
                return;
        }
    };

    const renderItemValueColumn = (item: PropertyItem, column: IColumn) => {
        const handleEditPropertyValue = React.useCallback((event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            const items = [...properties];
            const index = findMatchingItemIndex(item);
            items[index] = {...items[index], value: newValue};
            setProperties(items);
        },                                                [item]);

        const handleEditExpiryTime = React.useCallback((event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            const items = properties;
            const index = findMatchingItemIndex(item);
            items[index] = {...items[index], value: newValue};
            setShowExpiryError(!parseInt(newValue) || moment.utc(parseInt(newValue)) <= moment.utc()); // tslint:disable-line:radix
            setProperties(items);
        },                                             [item]);

        if (item.keyName === SystemProperties.ACK) {
            return renderAckDropdown(item);
        }
        if (item.keyName === SystemProperties.CONTENT_ENCODING) {
            return renderEncodingDropdown(item);
        }
        if (item.keyName === SystemProperties.EXPIRY_TIME_UTC) {
            return (
                <TextField
                    ariaLabel={t(ResourceKeys.cloudToDeviceMessage.properties.key)}
                    errorMessage={showExpiryError && t(ResourceKeys.cloudToDeviceMessage.properties.systemProperties.expiryTimeUtc.error)}
                    value={item.value}
                    onChange={handleEditExpiryTime}
                />);
        }
        else {
            return (
                <TextField
                    ariaLabel={t(ResourceKeys.cloudToDeviceMessage.properties.value)}
                    value={item.value}
                    onChange={handleEditPropertyValue}
                />);
        }
    };

    const renderAckDropdown = ( property: PropertyItem) => {
        const onDropdownSelectedKeyChanged = React.useCallback((event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption): void => {
            const items = properties;
            const index = findMatchingItemIndex(property);
            items[index] = {...items[index], value: option.key.toString()};
            setProperties(items);
        },                                                     [property]);

        const options: IDropdownOption[] = [
            {
                key: 'full',
                text: t(ResourceKeys.cloudToDeviceMessage.properties.systemProperties.ack.full)
            },
            {
                key: 'positive',
                text: t(ResourceKeys.cloudToDeviceMessage.properties.systemProperties.ack.positive)
            },
            {
                key: 'negative',
                text: t(ResourceKeys.cloudToDeviceMessage.properties.systemProperties.ack.negative)
            }
        ];

        return (
            <Dropdown
                options={options}
                onChange={onDropdownSelectedKeyChanged}
            />);
    };

    const renderEncodingDropdown = (property: PropertyItem) => {
        const onDropdownSelectedKeyChanged = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption): void => {
            const items = properties;
            const index = findMatchingItemIndex(property);
            items[index] = {...items[index], value: option.key.toString()};
            setProperties(items);
        };

        const options: IDropdownOption[] = [
            {
                key: 'utf-8',
                text: t(ResourceKeys.cloudToDeviceMessage.properties.systemProperties.contentEncoding.utf8)
            },
            {
                key:  'utf-16',
                text: t(ResourceKeys.cloudToDeviceMessage.properties.systemProperties.contentEncoding.utf16)
            },
            {
                key:  'utf-32',
                text: t(ResourceKeys.cloudToDeviceMessage.properties.systemProperties.contentEncoding.utf32)
            }
        ];
        return (
            <Dropdown
                options={options}
                onChange={onDropdownSelectedKeyChanged}
            />);
    };

    const onSelectionChanged = () => {
        setSelectedIndices(new Set(selection.getSelectedIndices()));
    };

    const handleAddCustomProperty = () => {
        const newIndex = propertyIndex + 1;
        const newProperties = [...properties, {isSystemProperty: false, index: newIndex, keyName: '', value: ''}];
        setProperties(newProperties);
        setPropertyIndex(newIndex);
    };

    const handleAddSystemProperty = (keyName: string) => () => {
        const newIndex = propertyIndex + 1;
        const newProperties = [...properties, {isSystemProperty: true,  index: newIndex, keyName, value: ''}];
        setProperties(newProperties);
        setPropertyIndex(newIndex);
    };

    const handleDelete = () => {
        const updatedProperties = [];
        for (let i = 0; i < properties.length; i++) {
            if (!selectedIndices.has(i)) {
                updatedProperties.push(properties[i]);
            }
        }
        setProperties(updatedProperties);
    };

    const onTextFieldChange = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newText: string) => {
        setBody(newText);
    };

    const onSendMessageClick = () => {
        const newProperties = properties
            .filter(property => property.keyName && property.value)
            .map(property => ({key: property.keyName, value: property.value, isSystemProperty: property.isSystemProperty}));

        if (!newProperties.some(property => property.key === SystemProperties.MESSAGE_ID)) {
            // populate a random message id
            newProperties.push({key: SystemProperties.MESSAGE_ID, value: uuid(), isSystemProperty: true});
        }

        const timeStamp = new Date().toLocaleString();
        props.onSendCloudToDeviceMessage({
            body: addTimestamp && body ? `${timeStamp} - ${body}` : (addTimestamp ? timeStamp : body),
            deviceId: getDeviceIdFromQueryString(search),
            properties: newProperties
        });
    };

    const findMatchingItemIndex = (property: PropertyItem): number => {
        let indexFound = -1;
        properties.forEach((element, index) => {
            if (element.index === property.index) {
                indexFound = index;
            }
        });
        return indexFound;
    };

    return (
        <>
            {showCommandBar()}
            <HeaderView
                headerText={ResourceKeys.cloudToDeviceMessage.headerText}
                tooltip={ResourceKeys.cloudToDeviceMessage.tooltip}
            />
            <div className="device-detail">
                {renderMessageBodySection()}
                {renderPropertiesSection()}
            </div>
    </>
    );
};
