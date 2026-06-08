/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { CommandBarV9 as CommandBar } from '../../../shared/components/commandBarV9';
import { DrawerBody, DrawerHeader, DrawerHeaderTitle, Field, Input, Label, OverlayDrawer, Textarea } from '@fluentui/react-components';
import { IColumn, ResizableDetailsList } from '../../../shared/resizeDetailsList/resizableDetailsList';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString } from '../../../shared/utils/queryStringHelper';
import { LabelWithTooltip } from '../../../shared/components/labelWithTooltip';
import { CollapsibleSection } from '../../../shared/components/collapsibleSection';
import { MaskedCopyableTextField } from '../../../shared/components/maskedCopyableTextField';
import { useHubInformationFromLocalStorage } from '../hooks/localStorageInformationRetriever';
import { AddCircleRegular, DeleteRegular } from '@fluentui/react-icons';
import './deviceSimulationPanel.scss';

export interface DeviceSimulationPanelProps {
    showSimulationPanel: boolean;
    onToggleSimulationPanel: () => void;
}

interface PropertyItem {
    index: number;
    keyName: string;
    value: string;
}

export const DeviceSimulationPanel: React.FC<DeviceSimulationPanelProps> = props => {
    const { t } = useTranslation();
    const { search } = useLocation();

    const deviceId = getDeviceIdFromQueryString(search);

    const hubConnectionString = useHubInformationFromLocalStorage().hubConnectionString;
    const [ simulationBody, setSimulationBody ] = React.useState<string>('');
    const [ propertyIndex, setPropertyIndex ] = React.useState<number>(0);
    const [ selectedIndices, setSelectedIndices ] = React.useState<Set<number>>(new Set());
    const [ properties, setProperties ] = React.useState<PropertyItem[]>([{index: 0, keyName: '', value: ''}]);

    const renderSimulationPanel= () => {
        return (
            <OverlayDrawer
                open={props.showSimulationPanel}
                position="end"
                size="medium"
                onOpenChange={(e, data) => { if (!data.open) {props.onToggleSimulationPanel();} }}
            >
                <DrawerHeader>
                    <DrawerHeaderTitle>
                        {t(ResourceKeys.deviceEvents.simulation.header)}
                    </DrawerHeaderTitle>
                </DrawerHeader>
                <DrawerBody>
                    <a target="_blank" role="link" href="https://shell.azure.com">
                        <img className="cloudShellButton"  alt={t(ResourceKeys.deviceEvents.simulation.cloudShell.imageDescription)} src="images/launchcloudshell.png" />
                    </a>
                    <Label>{t(ResourceKeys.deviceEvents.simulation.cloudShell.textDescription)}</Label>
                    <CollapsibleSection
                        expanded={true}
                        label={t(ResourceKeys.deviceEvents.simulation.prerequisite.label)}
                        tooltipText={t(ResourceKeys.deviceEvents.simulation.prerequisite.tooltiop)}
                    >
                        <span>{t(ResourceKeys.deviceEvents.simulation.prerequisite.instruction)}</span>
                    </CollapsibleSection>
                    <CollapsibleSection
                        expanded={true}
                        label={t(ResourceKeys.deviceEvents.simulation.basic.label)}
                        tooltipText={t(ResourceKeys.deviceEvents.simulation.basic.tooltiop)}
                    >
                        <span>{t(ResourceKeys.deviceEvents.simulation.basic.instruction)}</span>
                        <MaskedCopyableTextField
                            ariaLabel={t(ResourceKeys.deviceEvents.simulation.basic.copyLabel, {deviceId})}
                            label={t(ResourceKeys.deviceEvents.simulation.basic.copyLabel, {deviceId})}
                            value={`az iot device simulate --device-id ${deviceId} --login \"${hubConnectionString}\"`}
                            allowMask={false}
                        />
                    </CollapsibleSection>
                    <CollapsibleSection
                        expanded={false}
                        label={t(ResourceKeys.deviceEvents.simulation.advanced.label)}
                        tooltipText={t(ResourceKeys.deviceEvents.simulation.advanced.tooltiop)}
                    >
                        <span>{t(ResourceKeys.deviceEvents.simulation.advanced.instruction)}</span>
                        {renderMessageBodySection()}
                        {renderPropertiesList()}
                        <MaskedCopyableTextField
                            ariaLabel={t(ResourceKeys.deviceEvents.simulation.advanced.copyLabel, {deviceId})}
                            label={t(ResourceKeys.deviceEvents.simulation.advanced.copyLabel, {deviceId})}
                            value={convertToCliCommand()}
                            allowMask={false}
                        />
                    </CollapsibleSection>
                </DrawerBody>
            </OverlayDrawer>
        );
    };

    const renderMessageBodySection = () => {
        const textFieldRows = 5;
        return (
            <>
                <LabelWithTooltip
                    tooltipText={t(ResourceKeys.deviceEvents.simulation.advanced.body.tooltip)}
                >
                    {t(ResourceKeys.deviceEvents.simulation.advanced.body.label)}
                </LabelWithTooltip>
                <Textarea rows={textFieldRows} onChange={onTextFieldChange}/>
            </>
        );
    };

    const renderPropertiesList = () => {
        return (
            <>
                <CommandBar
                    className="properties-section-command-bar"
                    items={[
                        {
                            ariaLabel: t(ResourceKeys.deviceEvents.simulation.advanced.properties.addProperty),
                            icon: <AddCircleRegular />,
                            key: t(ResourceKeys.deviceEvents.simulation.advanced.properties.addProperty),
                            name: t(ResourceKeys.deviceEvents.simulation.advanced.properties.addProperty),
                            onClick: handleAddProperty
                        },
                        {
                            ariaLabel: t(ResourceKeys.deviceEvents.simulation.advanced.properties.delete),
                            disabled: selectedIndices.size === 0,
                            icon: <DeleteRegular />,
                            key: t(ResourceKeys.deviceEvents.simulation.advanced.properties.delete),
                            name: t(ResourceKeys.deviceEvents.simulation.advanced.properties.delete),
                            onClick: handleDelete
                        },
                    ]}
                />
                <ResizableDetailsList
                        items={properties}
                        columns={getColumns()}
                        onRenderItemColumn={renderItemColumn}
                        ariaLabelForSelectionColumn={t(ResourceKeys.deviceEvents.simulation.advanced.properties.toggleSelectionColumnAriaLabel)}
                        ariaLabelForSelectAllCheckbox={t(ResourceKeys.deviceEvents.simulation.advanced.properties.selectAllCheckboxAriaLabel)}
                        checkButtonAriaLabel={(item: any) => `${t(ResourceKeys.deviceEvents.simulation.advanced.properties.rowCheckBoxAriaLabel)} ${item.keyName || ''}`}
                        onSelectionChange={(indices) => setSelectedIndices(indices)}
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
                const hasDuplicateKey = (keyName: string) => keyName && properties.filter(property => property.keyName === keyName).length > 1;
                return (
                    <Field
                        validationMessage={hasDuplicateKey(item.keyName) ? t(ResourceKeys.deviceEvents.simulation.advanced.properties.keyDup) : undefined}
                        validationState={hasDuplicateKey(item.keyName) ? 'error' : 'none'}
                    >
                        <Input
                            aria-label={t(ResourceKeys.deviceEvents.simulation.advanced.properties.key)}
                            value={item.keyName}
                            onChange={handleEditCustomPropertyKey}
                        />
                    </Field>);
            case 'value':
                return renderItemValueColumn(item, column);
            default:
                return <></>;
        }
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

    const renderItemValueColumn = (item: PropertyItem, _column: IColumn) => {
        const index = findMatchingItemIndex(item);

        const handleEditPropertyValue = (event: React.ChangeEvent<HTMLInputElement>, data: { value: string }) => {
            const items = [...properties];
            items[index] = {...items[index], value: data.value};
            setProperties(items);
        };

        return (
            <Input
                aria-label={t(ResourceKeys.deviceEvents.simulation.advanced.properties.value)}
                value={item.value}
                onChange={handleEditPropertyValue}
            />);
    };

    const getColumns = (): IColumn[] => {
        return [
            {
                key: 'key',
                minWidth: 150,
                name: t(ResourceKeys.deviceEvents.simulation.advanced.properties.key),
            },
            {
                key: 'value',
                minWidth: 150,
                name: t(ResourceKeys.deviceEvents.simulation.advanced.properties.value),
            }
        ];
    };

    const handleAddProperty= () => {
        const newIndex = propertyIndex + 1;
        const newProperties = [...properties, {index: newIndex, keyName: '', value: ''}];
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
        setSimulationBody(data.value);
    };

    const convertToCliPropertyFormat = () => {
        let returnValue = '';
        properties.forEach(item => { if (item.keyName && item.value) {returnValue += `${item.keyName}=${item.value}`; }});
        return returnValue;
    };

    const convertToCliCommand = () => {
        let returnValue = `az iot device simulate --device-id ${deviceId} --login \"${hubConnectionString}\"`;
        if (simulationBody) {
            returnValue += ` --data \'${simulationBody}\'`;
        }
        const commandProperties = convertToCliPropertyFormat();
        if (commandProperties !== '') {
            returnValue += ` --properties \"${commandProperties}\"`;
        }
        return returnValue;
    };

    return renderSimulationPanel();
};
