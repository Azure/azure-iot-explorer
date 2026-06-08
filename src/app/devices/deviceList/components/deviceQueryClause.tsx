/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown, Option } from '@fluentui/react-components';
import { DismissCircleRegular } from '@fluentui/react-icons';
import { QueryClause, ParameterType, DeviceCapability, DeviceStatus } from '../../../api/models/deviceQuery';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import '../../../css/_deviceListQuery.scss';

export interface DeviceQueryClauseProps extends QueryClause {
    index: number;
}
export interface DeviceQueryClauseActions {
    removeClause: (index: number) => void;
    setClause: (index: number, clause: QueryClause & { isError: boolean }) => void;
}

export const DeviceQueryClause: React.FC<DeviceQueryClauseProps & DeviceQueryClauseActions> = (props: DeviceQueryClauseProps & DeviceQueryClauseActions) => {
    const { t } = useTranslation();

    const parameterTypeRef = React.useRef<HTMLButtonElement>(null);
    const { removeClause, setClause, index, operation, parameterType, value } = props;

    React.useEffect(() => {
        const node = parameterTypeRef.current;
        if (!!node) {
            node.focus();
        }
    },              []);

    const isError = (errorProps: QueryClause) => {
        return (!errorProps.parameterType ||
            (!errorProps.value || '' === errorProps.value));
    };

    const remove = () => removeClause(index);

    const onValueDropdownChange = (event: React.SyntheticEvent, data: { optionValue?: string }) => {
        const selectedValue = data.optionValue;
        setClause(
            index, {
                isError: isError({
                    operation,
                    parameterType,
                    value: selectedValue
                }),
                operation,
                parameterType,
                value: selectedValue
            }
        );
    };

    const onTypeChange = (event: React.SyntheticEvent, data: { optionValue?: string }) => {
        const selectedValue = data.optionValue;
        setClause(
            index, {
                isError: isError({
                    operation,
                    parameterType: selectedValue as ParameterType,
                    value: undefined
                }),
                operation,
                parameterType: selectedValue as ParameterType,
                value: undefined
            }
        );
    };

    const renderParameterDropdown = () => {
        return (
            <Dropdown
                className="parameter-type"
                onOptionSelect={onTypeChange}
                placeholder={t(ResourceKeys.deviceLists.query.searchPills.clause.parameterType.placeholder)}
                aria-label={t(ResourceKeys.deviceLists.query.searchPills.clause.parameterType.ariaLabel)}
                ref={parameterTypeRef}
            >
                {Object.keys(ParameterType).map(parameter => (
                    <Option
                        key={(ParameterType as any)[parameter]}
                        value={(ParameterType as any)[parameter]}
                    >
                        {t((ResourceKeys.deviceLists.query.searchPills.clause.parameterType.items as any)[parameter])}
                    </Option>
                ))}
            </Dropdown>
        );
    };

    const renderEdgeDropdownOptions = () => {
        return Object.keys(DeviceCapability).map
        (deviceCapability => (
            <Option
                key={(DeviceCapability as any)[deviceCapability]}
                value={(DeviceCapability as any)[deviceCapability]}
            >
                {t((ResourceKeys.deviceLists.query.searchPills.clause.value.deviceCapability as any)[deviceCapability])}
            </Option>
        ));
    };

    const renderStatusDropdownOptions = () => {
        return Object.keys(DeviceStatus).map
        (deviceStatus => (
            <Option
                key={(DeviceStatus as any)[deviceStatus]}
                value={(DeviceStatus as any)[deviceStatus]}
            >
                {t((ResourceKeys.deviceLists.query.searchPills.clause.value.deviceStatus as any)[deviceStatus])}
            </Option>
        ));
    };

    const renderValueInput =  () => {
        switch (parameterType) {
            case ParameterType.edge:
                return (
                    <Dropdown
                        className="clause-value"
                        onOptionSelect={onValueDropdownChange}
                        placeholder={t(ResourceKeys.deviceLists.query.searchPills.clause.value.placeholder)}
                        aria-label={t(ResourceKeys.deviceLists.query.searchPills.clause.value.placeholder)}
                        selectedOptions={value ? [value] : []}
                    >
                        {renderEdgeDropdownOptions()}
                    </Dropdown>
                );
            case ParameterType.status:
                return (
                    <Dropdown
                        className="clause-value"
                        onOptionSelect={onValueDropdownChange}
                        placeholder={t(ResourceKeys.deviceLists.query.searchPills.clause.value.placeholder)}
                        aria-label={t(ResourceKeys.deviceLists.query.searchPills.clause.value.placeholder)}
                        selectedOptions={value ? [value] : []}
                    >
                        {renderStatusDropdownOptions()}
                    </Dropdown>
                );
            default: return <></>;
        }
    };

    return (
        <section
            key={`query-${index}`}
            className={`search-pill active${isError(props) ? ' error' : ''}${' no-operator'}`}
        >
            {renderParameterDropdown()}
            {renderValueInput()}
            <Button
                appearance="subtle"
                className="remove-pill"
                icon={<DismissCircleRegular />}
                onClick={remove}
                aria-label={t(ResourceKeys.deviceLists.query.searchPills.clause.remove.ariaLabel)}
            />
        </section>
    );

};
