/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { CommandBarV9 as CommandBar } from '../../../shared/components/commandBarV9';
import { Dropdown, Field, Input, Label, Checkbox, Option, Textarea } from '@fluentui/react-components';
import { IColumn, ResizableDetailsList } from '../../../shared/resizeDetailsList/resizableDetailsList';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString } from '../../../shared/utils/queryStringHelper';
import { MailRegular, LocationRegular, AddCircleRegular, AddCircleFilled, DeleteRegular } from '@fluentui/react-icons';
import { CLOUD_TO_DEVICE_MESSAGE } from '../../../constants/commandBarItemKeys';
import { LabelWithTooltip } from '../../../shared/components/labelWithTooltip';
import { cloudToDeviceMessageAction } from '../actions';
import { CollapsibleSection } from '../../../shared/components/collapsibleSection';
import { HeaderView } from '../../../shared/components/headerView';
import { useAsyncSagaReducer } from '../../../shared/hooks/useAsyncSagaReducer';
import { cloudToDeviceMessageSaga } from '../saga';
import { AppInsightsClient } from '../../../shared/appTelemetry/appInsightsClient';
import { TELEMETRY_PAGE_NAMES, TELEMETRY_USER_ACTIONS } from '../../../../app/constants/telemetry';
import { LiveRegion } from '../../../shared/components/liveRegion';
import '../../../css/_deviceDetail.scss';

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

export const CloudToDeviceMessage: React.FC = () => {
    const { t } = useTranslation();
    const { search } = useLocation();

    const [ , dispatch ] = useAsyncSagaReducer((): undefined => undefined, cloudToDeviceMessageSaga, undefined);
    const [ properties, setProperties ] = React.useState([{index: 0, keyName: '', isSystemProperty: false, value: ''}]);
    const [ addTimestamp, setAddTimestamp ] = React.useState<boolean>(false);
    const [ body, setBody ] = React.useState<string>('');
    const [ propertyIndex, setPropertyIndex ] = React.useState<number>(0);
    const [ selectedIndices, setSelectedIndices ] = React.useState(new Set());
    const [ showExpiryError, setShowExpiryError ] = React.useState<boolean>(false);
    const [ announcement, setAnnouncement ] = React.useState('');

    React.useEffect(() => {
        AppInsightsClient.getInstance()?.trackPageView({name: TELEMETRY_PAGE_NAMES.CLOUD_TO_DEVICE_MESSAGE});
    }, []); // tslint:disable-line: align

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
                        icon: <MailRegular />,
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
        const systemPropertySubMenuProps = systemPropertyKeyNameMappings.map(keyNameMap =>
            ({
                disabled: properties.some(property => property.keyName === keyNameMap.keyName),
                icon: <LocationRegular />,
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
                            icon: <AddCircleRegular />,
                            key: t(ResourceKeys.cloudToDeviceMessage.properties.addCustomProperty),
                            name: t(ResourceKeys.cloudToDeviceMessage.properties.addCustomProperty),
                            onClick: handleAddCustomProperty
                        },
                        {
                            ariaLabel: t(ResourceKeys.cloudToDeviceMessage.properties.addSystemProperty),
                            icon: <AddCircleFilled />,
                            key: t(ResourceKeys.cloudToDeviceMessage.properties.addSystemProperty),
                            name: t(ResourceKeys.cloudToDeviceMessage.properties.addSystemProperty),
                            subMenuProps: {
                                items: systemPropertySubMenuProps
                            }
                        },
                        {
                            ariaLabel: t(ResourceKeys.cloudToDeviceMessage.properties.delete),
                            disabled: selectedIndices.size === 0,
                            icon: <DeleteRegular />,
                            key: t(ResourceKeys.cloudToDeviceMessage.properties.delete),
                            name: t(ResourceKeys.cloudToDeviceMessage.properties.delete),
                            onClick: handleDelete
                        },
                    ]}
                />
                <ResizableDetailsList
                        items={properties}
                        columns={getColumns()}
                        onRenderItemColumn={renderItemColumn}
                        ariaLabelForSelectionColumn={t(ResourceKeys.cloudToDeviceMessage.properties.toggleSelectionColumnAriaLabel)}
                        ariaLabelForSelectAllCheckbox={t(ResourceKeys.cloudToDeviceMessage.properties.selectAllCheckboxAriaLabel)}
                        checkButtonAriaLabel={(item: any) => `${t(ResourceKeys.cloudToDeviceMessage.properties.rowCheckBoxAriaLabel)} ${item.keyName || ''}`}
                        onSelectionChange={(indices) => setSelectedIndices(indices)}
                    />
            </>
        );
    };

    const getColumns = (): IColumn[] => {
        return [
            {
                key: 'key',
                minWidth: 400,
                name: t(ResourceKeys.cloudToDeviceMessage.properties.key),
                width: '80%',
            },
            {
                key: 'value',
                minWidth: 100,
                name: t(ResourceKeys.cloudToDeviceMessage.properties.value),
                width: '20%',
            }
        ];
    };

    const onCheckboxChange = (ev: React.ChangeEvent<HTMLInputElement>, data: { checked: boolean | 'mixed' }) => {
        setAddTimestamp(!!data.checked);
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
                <Textarea
                    className="cloud-to-device-message-text-field"
                    rows={textFieldRows}
                    onChange={onTextFieldChange}
                    aria-label={t(ResourceKeys.cloudToDeviceMessage.body)}
                />
                <Checkbox
                    label={t(ResourceKeys.cloudToDeviceMessage.addTimestamp)}
                    aria-label={t(ResourceKeys.cloudToDeviceMessage.addTimestamp)}
                    onChange={onCheckboxChange}
                    style={{ marginBottom: 20 }}
                />
            </>
        );
    };

    const renderItemColumn = (item: PropertyItem, index: number, column: IColumn) => {
        const handleEditCustomPropertyKey = (event: React.ChangeEvent<HTMLInputElement>, data: { value: string }) => {
            const items = [...properties];
            items[index] = {...items[index], keyName: data.value};
            setProperties(items);
        };

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
                        <Field
                            validationMessage={hasDuplicateKey(item.keyName) ? t(ResourceKeys.cloudToDeviceMessage.properties.keyDup) : undefined}
                            validationState={hasDuplicateKey(item.keyName) ? 'error' : 'none'}
                        >
                            <Input
                                aria-label={t(ResourceKeys.cloudToDeviceMessage.properties.key)}
                                value={item.keyName}
                                onChange={handleEditCustomPropertyKey}
                            />
                        </Field>);
                }
            case 'value':
                return renderItemValueColumn(item, column);
            default:
                return <></>;
        }
    };

    const renderItemValueColumn = (item: PropertyItem, column: IColumn) => {
        const index = findMatchingItemIndex(item);

        const handleEditPropertyValue = (event: React.ChangeEvent<HTMLInputElement>, data: { value: string }) => {
            const items = [...properties];
            items[index] = {...items[index], value: data.value};
            setProperties(items);
        };

        const handleEditExpiryTime = (event: React.ChangeEvent<HTMLInputElement>, data: { value: string }) => {
            const items = [...properties];
            items[index] = {...items[index], value: data.value};
            setShowExpiryError(!parseInt(data.value) || new Date(parseInt(data.value)) <= new Date()); // tslint:disable-line:radix
            setProperties(items);
        };

        if (item.keyName === SystemProperties.ACK) {
            return renderAckDropdown(item);
        }
        if (item.keyName === SystemProperties.CONTENT_ENCODING) {
            return renderEncodingDropdown(item);
        }
        if (item.keyName === SystemProperties.EXPIRY_TIME_UTC) {
            return (
                <Field
                    validationMessage={showExpiryError ? t(ResourceKeys.cloudToDeviceMessage.properties.systemProperties.expiryTimeUtc.error) : undefined}
                    validationState={showExpiryError ? 'error' : 'none'}
                >
                    <Input
                        aria-label={t(ResourceKeys.cloudToDeviceMessage.properties.key)}
                        value={item.value}
                        onChange={handleEditExpiryTime}
                    />
                </Field>);
        }
        else {
            return (
                <Input
                    aria-label={t(ResourceKeys.cloudToDeviceMessage.properties.value)}
                    value={item.value}
                    onChange={handleEditPropertyValue}
                />);
        }
    };

    const renderAckDropdown = ( property: PropertyItem) => {
        const index = findMatchingItemIndex(property);

        const onDropdownSelectedKeyChanged = (event: React.SyntheticEvent, data: { optionValue?: string }): void => {
            const items = properties;
            items[index] = {...items[index], value: data.optionValue};
            setProperties(items);
        };

        return (
            <Dropdown
                onOptionSelect={onDropdownSelectedKeyChanged}
            >
                <Option value="full">{t(ResourceKeys.cloudToDeviceMessage.properties.systemProperties.ack.full)}</Option>
                <Option value="positive">{t(ResourceKeys.cloudToDeviceMessage.properties.systemProperties.ack.positive)}</Option>
                <Option value="negative">{t(ResourceKeys.cloudToDeviceMessage.properties.systemProperties.ack.negative)}</Option>
            </Dropdown>);
    };

    const renderEncodingDropdown = (property: PropertyItem) => {
        const index = findMatchingItemIndex(property);

        const onDropdownSelectedKeyChanged = (event: React.SyntheticEvent, data: { optionValue?: string }): void => {
            const items = properties;
            items[index] = {...items[index], value: data.optionValue};
            setProperties(items);
        };

        return (
            <Dropdown
                onOptionSelect={onDropdownSelectedKeyChanged}
            >
                <Option value="utf-8">{t(ResourceKeys.cloudToDeviceMessage.properties.systemProperties.contentEncoding.utf8)}</Option>
                <Option value="utf-16">{t(ResourceKeys.cloudToDeviceMessage.properties.systemProperties.contentEncoding.utf16)}</Option>
                <Option value="utf-32">{t(ResourceKeys.cloudToDeviceMessage.properties.systemProperties.contentEncoding.utf32)}</Option>
            </Dropdown>);
    };

    const handleAddCustomProperty= () => {
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

    const onTextFieldChange = (ev: React.ChangeEvent<HTMLTextAreaElement>, data: { value: string }) => {
        setBody(data.value);
    };

    const onSendMessageClick = () => {
        const newProperties = properties
            .filter(property => property.keyName && property.value)
            .map(property => ({key: property.keyName, value: property.value, isSystemProperty: property.isSystemProperty}));

        if (!newProperties.some(property => property.key === SystemProperties.MESSAGE_ID)) {
            // populate a random message id
            newProperties.push({key: SystemProperties.MESSAGE_ID, value: uuid(), isSystemProperty: true});
        }

        AppInsightsClient.trackUserAction(TELEMETRY_USER_ACTIONS.SEND_C2D_MESSAGE);

        const timeStamp = new Date().toLocaleString();
        dispatch(cloudToDeviceMessageAction.started({
            body: addTimestamp && body ? `${timeStamp} - ${body}` : (addTimestamp ? timeStamp : body),
            deviceId: getDeviceIdFromQueryString(search),
            properties: newProperties
        }));
        setAnnouncement(t(ResourceKeys.cloudToDeviceMessage.sendMessageButtonText));
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
            <LiveRegion message={announcement} />
    </>
    );
};
