/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown, IDropdown, IDropdownOption, IconButton } from '@fluentui/react';
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

    const parameterTypeRef = React.createRef<IDropdown>();
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

    const onValueDropdownChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
        setClause(
            index, {
                isError: isError({
                    operation,
                    parameterType,
                    value: option.key as string
                }),
                operation,
                parameterType,
                value: option.key as string
            }
        );
    };

    const onTypeChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
        setClause(
            index, {
                isError: isError({
                    operation,
                    parameterType: option.key as ParameterType,
                    value: undefined
                }),
                operation,
                parameterType: option.key as ParameterType,
                value: undefined
            }
        );
    };

    const renderParameterDropdown = () => {
        return (
            <Dropdown
                className="parameter-type"
                options={Object.keys(ParameterType).map(
                    parameter => ({
                        key: (ParameterType as any)[parameter], // tslint:disable-line: no-any
                        text: t((ResourceKeys.deviceLists.query.searchPills.clause.parameterType.items as any)[parameter])// tslint:disable-line: no-any
                    }))}
                onChange={onTypeChange}
                placeholder={t(ResourceKeys.deviceLists.query.searchPills.clause.parameterType.placeholder)}
                ariaLabel={t(ResourceKeys.deviceLists.query.searchPills.clause.parameterType.ariaLabel)}
                componentRef={parameterTypeRef}
            />
        );
    };

    const renderEdgeDropdownOptions = () => {
        return Object.keys(DeviceCapability).map
        (deviceCapability => ({
            ariaLabel: t((ResourceKeys.deviceLists.query.searchPills.clause.value.deviceCapability as any)[deviceCapability]), // tslint:disable-line: no-any
            key: (DeviceCapability as any)[deviceCapability], // tslint:disable-line: no-any
            text: t((ResourceKeys.deviceLists.query.searchPills.clause.value.deviceCapability as any)[deviceCapability]), // tslint:disable-line: no-any
        }));
    };

    const renderStatusDropdownOptions = () => {
        return Object.keys(DeviceStatus).map
        (deviceStatus => ({
            key: (DeviceStatus as any)[deviceStatus], // tslint:disable-line: no-any
            text: t((ResourceKeys.deviceLists.query.searchPills.clause.value.deviceStatus as any)[deviceStatus]), // tslint:disable-line: no-any
        }));
    };

    const renderValueInput =  () => {
        switch (parameterType) {
            case ParameterType.edge:
                return (
                    <Dropdown
                        className="clause-value"
                        options={renderEdgeDropdownOptions()}
                        onChange={onValueDropdownChange}
                        placeholder={t(ResourceKeys.deviceLists.query.searchPills.clause.value.placeholder)}
                        ariaLabel={t(ResourceKeys.deviceLists.query.searchPills.clause.value.placeholder)}
                        selectedKey={value || ''}
                    />
                );
            case ParameterType.status:
                return (
                    <Dropdown
                        className="clause-value"
                        options={renderStatusDropdownOptions()}
                        onChange={onValueDropdownChange}
                        placeholder={t(ResourceKeys.deviceLists.query.searchPills.clause.value.placeholder)}
                        ariaLabel={t(ResourceKeys.deviceLists.query.searchPills.clause.value.placeholder)}
                        selectedKey={value || ''}
                    />
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
            <IconButton
                className="remove-pill"
                data={index}
                iconProps={{ iconName: 'Clear' }}
                type="button"
                onClick={remove}
                ariaLabel={t(ResourceKeys.deviceLists.query.searchPills.clause.remove.ariaLabel)}
            />
        </section>
    );

};
