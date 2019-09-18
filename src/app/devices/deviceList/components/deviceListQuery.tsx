/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { ActionButton, IconButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import '../../../css/_deviceListQuery.scss';
import DeviceQueryClause from './deviceQueryClause';
import DeviceQuery, { QueryClause } from '../../../api/models/deviceQuery';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../shared/contexts/localizationContext';

export interface DeviceListQueryProps {
    query: DeviceQuery;
}
export interface DeviceListQueryActions {
    setQuery: (query?: DeviceQuery) => void;
    executeQuery: () => void;
}

export default class DeviceListQuery extends React.Component<DeviceListQueryProps & DeviceListQueryActions> {
    // tslint:disable-next-line:cyclomatic-complexity
    constructor(props: DeviceListQueryProps & DeviceListQueryActions) {
        super(props);

        this.state = {
            clauses: (props.query && props.query.clauses && props.query.clauses.map(clause => {
                return { ...clause, isError: false };
            })) || [],
            deviceId: (props.query && props.query.deviceId) || '',
        };
    }
    private readonly removePill = (index: number) => {
        const clauses = [...this.props.query.clauses];
        clauses.splice(index, 1);
        this.props.setQuery(
            {
                clauses,
                continuationTokens: [],
                currentPageIndex: 0,
                deviceId: ''
            }
        );
    }
    private readonly setClause = (index: number, clause: QueryClause) => {
        const clauses = [...this.props.query.clauses];
        clauses[index] = clause;
        this.props.setQuery(
            {
                clauses,
                continuationTokens: [],
                currentPageIndex: 0,
                deviceId: ''
            }
        );
    }

    private readonly onSetDeviceId = (e: unknown, deviceId: string) => {
        this.props.setQuery({
            clauses: [],
            continuationTokens: [],
            currentPageIndex: 0,
            deviceId
        });
    }

    private readonly onAddClause = () => {
        this.props.setQuery({
            clauses: [...this.props.query.clauses, {
                isError: true
            }],
            continuationTokens: [],
            currentPageIndex: 0,
            deviceId: ''
        });
    }
    private readonly onExecuteQuery = () => {
        this.props.executeQuery();
    }

    private readonly onDeviceIdKeyUp = (arg: {key: string}) => {
        if (arg && 'Enter' === arg.key) {
            return this.props.executeQuery();
        }
    }

    public render(): JSX.Element {
        const { clauses, deviceId } = this.props.query;
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <section role="search" className="deviceList-query">
                        <div className="deviceId-search">
                            <TextField
                                borderless={true}
                                placeholder={context.t(ResourceKeys.deviceLists.query.deviceId.placeholder)}
                                ariaLabel={context.t(ResourceKeys.deviceLists.query.deviceId.ariaLabel)}
                                className="search-box"
                                iconProps={{ iconName: 'Search' }}
                                role="searchbox"
                                value={deviceId}
                                onChange={this.onSetDeviceId}
                                onKeyUp={this.onDeviceIdKeyUp}
                            />
                            <IconButton
                                className="search-button"
                                iconProps={{ iconName: 'Forward' }}
                                type="submit"
                                onClick={this.onExecuteQuery}
                                title={context.t(ResourceKeys.deviceLists.query.deviceId.searchButton.title)}
                                ariaLabel={context.t(ResourceKeys.deviceLists.query.deviceId.searchButton.ariaLabel)}
                                disabled={!!clauses && clauses.length > 0}
                            />
                        </div>
                        <div className="clauses">
                            {(clauses || []).map((clause, index) => <DeviceQueryClause
                                key={`query_clause:${index}`}
                                index={index}
                                operation={clause.operation}
                                parameterType={clause.parameterType}
                                removeClause={this.removePill}
                                setClause={this.setClause}
                                value={clause.value}
                            />)}
                            {clauses && clauses.length > 0 && <PrimaryButton
                                className="search-pill"
                                onClick={this.onExecuteQuery}
                                title={context.t(ResourceKeys.deviceLists.query.searchPills.search.title)}
                                ariaLabel={context.t(ResourceKeys.deviceLists.query.searchPills.search.ariaLabel)}
                            >
                                {context.t(ResourceKeys.deviceLists.query.searchPills.search.text)}
                            </PrimaryButton>}
                            <ActionButton
                                className="search-pill"
                                iconProps={{ iconName: 'Filter' }}
                                type="button"
                                onClick={this.onAddClause}
                                title={context.t(ResourceKeys.deviceLists.query.searchPills.add.title)}
                                ariaLabel={context.t(ResourceKeys.deviceLists.query.searchPills.add.ariaLabel)}
                            >
                                {context.t(ResourceKeys.deviceLists.query.searchPills.add.text)}
                            </ActionButton>
                        </div>
                    </section>
                )}
            </LocalizationContextConsumer>
        );
    }
}
