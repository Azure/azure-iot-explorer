/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Dropdown, IDropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { QueryClause, ParameterType, DeviceCapability, DeviceStatus } from '../../../api/models/deviceQuery';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../shared/contexts/localizationContext';
import '../../../css/_deviceListQuery.scss';

export interface DeviceQueryClauseProps extends QueryClause {
    index: number;
}
export interface DeviceQueryClauseActions {
    removeClause: (index: number) => void;
    setClause: (index: number, clause: QueryClause & { isError: boolean }) => void;
}

export default class DeviceQueryClause extends React.PureComponent<DeviceQueryClauseProps & DeviceQueryClauseActions> {
    private readonly parameterTypeRef = React.createRef<IDropdown>();

    private readonly isError = (props: QueryClause) => {
        return (!props.parameterType ||
            (!props.value || '' === props.value));
    }

    private readonly remove = () => {
        this.props.removeClause(this.props.index);
    }

    private readonly onValueDropdownChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
        this.props.setClause(
            this.props.index, {
                isError: this.isError({
                    operation: this.props.operation,
                    parameterType: this.props.parameterType,
                    value: option.key as string
                }),
                operation: this.props.operation,
                parameterType: this.props.parameterType,
                value: option.key as string
            }
        );
    }

    private readonly onTypeChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
        const parameterType = option.key as ParameterType;
        this.props.setClause(
            this.props.index, {
                isError: this.isError({
                    operation: this.props.operation,
                    parameterType,
                    value: undefined
                }),
                operation: this.props.operation,
                parameterType,
                value: undefined
            }
        );
    }

    public componentDidMount() {
        // set focus to parameter type dropdown
        const node = this.parameterTypeRef.current;
        if (!!node) {
            node.focus();
        }
    }

    public render(): JSX.Element {
        const isError = this.isError(this.props);
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <section
                        key={`query-${this.props.index}`}
                        className={`search-pill active${isError ? ' error' : ''}${' no-operator'}`}
                    >
                        {this.renderParameterDropdown(context)}
                        {this.renderValueInput(context)}
                        <IconButton
                            className="remove-pill"
                            data={this.props.index}
                            iconProps={{ iconName: 'Clear' }}
                            type="button"
                            onClick={this.remove}
                            title={context.t(ResourceKeys.deviceLists.query.searchPills.clause.remove.title)}
                            ariaLabel={context.t(ResourceKeys.deviceLists.query.searchPills.clause.remove.ariaLabel)}
                        />
                    </section>
                )}
            </LocalizationContextConsumer>
        );
    }

    private readonly renderParameterDropdown = (context: LocalizationContextInterface) => {
        return (
            <Dropdown
                className="parameter-type"
                options={Object.keys(ParameterType).map(
                    parameterType => ({
                        key: (ParameterType as any)[parameterType], // tslint:disable-line: no-any
                        text: context.t((ResourceKeys.deviceLists.query.searchPills.clause.parameterType.items as any)[parameterType])// tslint:disable-line: no-any
                    }))}
                onChange={this.onTypeChange}
                title={context.t(ResourceKeys.deviceLists.query.searchPills.clause.parameterType.title)}
                ariaLabel={context.t(ResourceKeys.deviceLists.query.searchPills.clause.parameterType.ariaLabel)}
                componentRef={this.parameterTypeRef}
            />
        );
    }

    private readonly renderEdgeDropdownOptions = (context: LocalizationContextInterface) => {
        return Object.keys(DeviceCapability).map
        (deviceCapability => ({
            ariaLabel: context.t((ResourceKeys.deviceLists.query.searchPills.clause.value.deviceCapability as any)[deviceCapability]), // tslint:disable-line: no-any
            key: (DeviceCapability as any)[deviceCapability], // tslint:disable-line: no-any
            text: context.t((ResourceKeys.deviceLists.query.searchPills.clause.value.deviceCapability as any)[deviceCapability]), // tslint:disable-line: no-any
        }));
    }

    private readonly renderStatusDropdownOptions = (context: LocalizationContextInterface) => {
        return Object.keys(DeviceStatus).map
        (deviceStatus => ({
            key: (DeviceStatus as any)[deviceStatus], // tslint:disable-line: no-any
            text: context.t((ResourceKeys.deviceLists.query.searchPills.clause.value.deviceStatus as any)[deviceStatus]), // tslint:disable-line: no-any
        }));
    }

    private readonly renderValueInput =  (context: LocalizationContextInterface) => {
        switch (this.props.parameterType) {
            case ParameterType.edge:
                return (
                    <Dropdown
                        className="clause-value"
                        options={this.renderEdgeDropdownOptions(context)}
                        onChange={this.onValueDropdownChange}
                        title={context.t(ResourceKeys.deviceLists.query.searchPills.clause.value.title)}
                        ariaLabel={context.t(ResourceKeys.deviceLists.query.searchPills.clause.value.title)}
                        selectedKey={this.props.value || ''}
                    />
                );
            case ParameterType.status:
                return (
                    <Dropdown
                        className="clause-value"
                        options={this.renderStatusDropdownOptions(context)}
                        onChange={this.onValueDropdownChange}
                        title={context.t(ResourceKeys.deviceLists.query.searchPills.clause.value.title)}
                        ariaLabel={context.t(ResourceKeys.deviceLists.query.searchPills.clause.value.title)}
                        selectedKey={this.props.value || ''}
                    />
                );
            default: return <></>;
        }
    }
}
