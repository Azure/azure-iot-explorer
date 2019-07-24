/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { ComboBox } from 'office-ui-fabric-react/lib/ComboBox';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import '../../../css/_deviceListQuery.scss';
import { QueryClause, ParameterType, OperationType } from '../../../api/models/deviceQuery';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../shared/contexts/localizationContext';

export interface DeviceQueryClauseProps extends QueryClause {
    index: number;
}
export interface DeviceQueryClauseActions {
    removeClause: (index: number) => void;
    setClause: (index: number, clause: QueryClause & { isError: boolean }) => void;
}

export default class DeviceQueryClause extends React.PureComponent<DeviceQueryClauseProps & DeviceQueryClauseActions> {
    constructor(props: DeviceQueryClauseProps & DeviceQueryClauseActions) {
        super(props);
    }
    private readonly isError = (props: QueryClause) => {
        return (
            (!props.operation && this.shouldShowOperator(props.parameterType)) ||
            !props.parameterType ||
            (!props.value || '' === props.value));
    }
    private readonly remove = () => {
        this.props.removeClause(this.props.index);
    }

    private readonly onValueChange = (e: unknown, value: string) => {
        this.props.setClause(
            this.props.index, {
                isError: this.isError({
                    operation: this.props.operation,
                    parameterType: this.props.parameterType,
                    value
                }),
                operation: this.props.operation,
                parameterType: this.props.parameterType,
                value
            }
        );
    }

    private readonly onTypeChange = (e: unknown, option: { key: unknown }) => {
        const parameterType = this.getEnumValueOfParameterType(option.key as string);
        this.props.setClause(
            this.props.index, {
                isError: this.isError({
                    operation: this.props.operation,
                    parameterType,
                    value: this.props.value
                }),
                operation: this.props.operation,
                parameterType,
                value: this.props.value
            }
        );
    }

    private readonly shouldShowOperator = (parameterType: ParameterType) => {
        return ParameterType.capabilityModelId !== parameterType && ParameterType.interfaceId !== parameterType;
    }

    // tslint:disable-next-line:cyclomatic-complexity
    private readonly getEnumValueOfParameterType = (key: string) => {
        switch (key.toLowerCase()) {
            case ParameterType.capabilityModelId.toLowerCase():
                return ParameterType.capabilityModelId;
            case ParameterType.interfaceId.toLowerCase():
                return ParameterType.interfaceId;
                case ParameterType.status.toLowerCase():
                    return ParameterType.status;
/*            case ParameterType.lastActivityTime.toLowerCase():
                return ParameterType.lastActivityTime;
            case ParameterType.propertyValue.toLowerCase():
                return ParameterType.propertyValue;
            case ParameterType.statusUpdateTime.toLowerCase():
                return ParameterType.statusUpdateTime;
*/
            default:
                throw new Error(`ParameterType does not include '${key}'.`);
        }
    }

    private readonly onOperationChange = (e: unknown, option: { key: unknown }) => {
        const operation = this.getEnumValueOfOperationType(option.key as string);
        this.props.setClause(
            this.props.index, {
                isError: this.isError({
                    operation,
                    parameterType: this.props.parameterType,
                    value: this.props.value
                }),
                operation,
                parameterType: this.props.parameterType,
                value: this.props.value
            }
        );
    }
    // tslint:disable-next-line:cyclomatic-complexity
    private readonly getEnumValueOfOperationType = (key: string) => {
        switch (key.toLowerCase()) {
            case OperationType.equals.toLowerCase():
                return OperationType.equals;
            // case OperationType.greaterThan.toLowerCase():
            //     return OperationType.greaterThan;
            // case OperationType.greaterThanEquals.toLowerCase():
            //     return OperationType.greaterThanEquals;
            // case OperationType.inequal.toLowerCase():
            //     return OperationType.inequal;
            // case OperationType.lessThan.toLowerCase():
            //     return OperationType.lessThan;
            // case OperationType.lessThanEquals.toLowerCase():
            //     return OperationType.lessThanEquals;
            case OperationType.notEquals.toLowerCase():
                return OperationType.notEquals;
            default:
                throw new Error(`OperationType does not include '${key}'.`);
        }
    }

    // tslint:disable-next-line: cyclomatic-complexity
    private readonly getParameterTypeString = (parameterType: ParameterType, t: (value: string) => string) => {
        switch (parameterType) {
            case ParameterType.capabilityModelId:
                return t(ResourceKeys.deviceLists.query.searchPills.clause.parameterType.items.capabilityModelId);
            case ParameterType.interfaceId:
                return t(ResourceKeys.deviceLists.query.searchPills.clause.parameterType.items.interfaceId);
                case ParameterType.status:
                    return t(ResourceKeys.deviceLists.query.searchPills.clause.parameterType.items.status);
/*              case ParameterType.lastActivityTime:
                    return t(ResourceKeys.deviceLists.query.searchPills.clause.parameterType.items.lastActivityTime);
                case ParameterType.propertyValue:
                    return t(ResourceKeys.deviceLists.query.searchPills.clause.parameterType.items.propertyValue);
            case ParameterType.statusUpdateTime:
                return t(ResourceKeys.deviceLists.query.searchPills.clause.parameterType.items.statusUpdateTime);
*/
            default:
                return '';
        }
    }

    public render(): JSX.Element {
        const isError = this.isError(this.props);
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <section
                        key={`query-${this.props.index}`}
                        className={`search-pill active${isError ? ' error' : ''}${this.shouldShowOperator(this.props.parameterType) ? '' : ' no-operator'}`}
                    >
                        <ComboBox
                            className="parameter-type"
                            autoComplete="on"
                            // tslint:disable-next-line: no-any
                            options={Object.keys(ParameterType).map(parameterType => ({ key: (ParameterType as any)[parameterType], text: this.getParameterTypeString((ParameterType as any)[parameterType], context.t) }))}
                            onChange={this.onTypeChange}
                            text={this.getParameterTypeString(this.props.parameterType, context.t)}
                            title={context.t(ResourceKeys.deviceLists.query.searchPills.clause.parameterType.title)}
                            ariaLabel={context.t(ResourceKeys.deviceLists.query.searchPills.clause.parameterType.ariaLabel)}
                        />
                        {
                            this.shouldShowOperator(this.props.parameterType) && <ComboBox
                                className="operation-type"
                                // tslint:disable-next-line: no-any
                                options={Object.keys(OperationType).map(operationType => ({ key: (OperationType as any)[operationType], text: (OperationType as any)[operationType] }))}
                                onChange={this.onOperationChange}
                                value={this.props.operation}
                                title={context.t(ResourceKeys.deviceLists.query.searchPills.clause.operationType.title)}
                                ariaLabel={context.t(ResourceKeys.deviceLists.query.searchPills.clause.operationType.ariaLabel)}
                            />
                        }
                        <TextField
                            className="clause-value"
                            placeholder={context.t(ResourceKeys.deviceLists.query.searchPills.clause.value.placeholder)}
                            ariaLabel={context.t(ResourceKeys.deviceLists.query.searchPills.clause.value.ariaLabel)}
                            required={true}
                            title={context.t(ResourceKeys.deviceLists.query.searchPills.clause.value.title)}
                            onChange={this.onValueChange}
                            value={this.props.value}
                        />
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
}
