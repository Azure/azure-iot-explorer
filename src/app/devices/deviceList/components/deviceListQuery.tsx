/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { ActionButton, IconButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import DeviceQueryClause from './deviceQueryClause';
import DeviceQuery, { QueryClause } from '../../../api/models/deviceQuery';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../shared/contexts/localizationContext';
import '../../../css/_deviceListQuery.scss';

export interface DeviceListQueryProps {
    refresh: number;
    setQueryAndExecute: (query: DeviceQuery, executeQuery?: boolean) => void;
}

export interface DeviceListQueryState {
    clauses: QueryClause[];
    deviceId: string;
}

export default class DeviceListQuery extends React.Component<DeviceListQueryProps, DeviceListQueryState> {
    constructor(props: DeviceListQueryProps) {
        super(props);
        this.state = {
            clauses: [],
            deviceId: ''
        };
    }

    private readonly removePill = (index: number) => {
        const clauses = [...this.state.clauses];
        clauses.splice(index, 1);
        this.setState(
            {
                clauses
            }
        );
    }

    private readonly setClause = (index: number, clause: QueryClause) => {
        const clauses = [...this.state.clauses];
        clauses[index] = clause;
        this.setState(
            {
                clauses
            }
        );
    }

    private readonly onAddClause = () => {
        this.setState({
            clauses: [...this.state.clauses, {
                isError: true
            }],
            deviceId: ''
        });
    }

    private readonly onDeviceIdKeyUp = (arg: {key: string}) => {
        if (arg && 'Enter' === arg.key) {
            this.setQueryFromSearchBoxAndExecute();
        }
    }

    private readonly onSetDeviceId = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        this.setState({
            clauses: [],
            deviceId: newValue
        });
    }

    private readonly setQueryFromSearchBoxAndExecute = () => {
        this.props.setQueryAndExecute(
            {
                clauses: [],
                continuationTokens: [],
                currentPageIndex: 0,
                deviceId: this.state.deviceId
            }
        );
    }

    private readonly setQueryFromQueryPillsAndExecute = () => {
        this.props.setQueryAndExecute(
            {
                clauses: this.state.clauses,
                continuationTokens: [],
                currentPageIndex: 0,
                deviceId: ''
            }
        );
    }

    private readonly renderIdSearch = (context: LocalizationContextInterface) => {
        const { clauses, deviceId } = this.state;
        return (
            <div className="deviceId-search">
                <TextField
                    borderless={true}
                    placeholder={context.t(ResourceKeys.deviceLists.query.deviceId.placeholder)}
                    ariaLabel={context.t(ResourceKeys.deviceLists.query.deviceId.ariaLabel)}
                    className="search-box"
                    iconProps={{ iconName: 'Search' }}
                    role="searchbox"
                    onKeyUp={this.onDeviceIdKeyUp}
                    value={deviceId}
                    onChange={this.onSetDeviceId}
                />
                <IconButton
                    className="search-button"
                    iconProps={{ iconName: 'Forward' }}
                    type="submit"
                    onClick={this.setQueryFromSearchBoxAndExecute}
                    title={context.t(ResourceKeys.deviceLists.query.deviceId.searchButton.title)}
                    ariaLabel={context.t(ResourceKeys.deviceLists.query.deviceId.searchButton.ariaLabel)}
                    disabled={!!clauses && clauses.length > 0}
                />
            </div>
        );
    }

    private readonly renderClauses = (context: LocalizationContextInterface) => {
        const { clauses } = this.state;
        return (
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
                    onClick={this.setQueryFromQueryPillsAndExecute}
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
        );
    }

    public render(): JSX.Element {
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <section role="search" className="deviceList-query">
                        {this.renderIdSearch(context)}
                        {this.renderClauses(context)}
                    </section>
                )}
            </LocalizationContextConsumer>
        );
    }

    public componentDidUpdate(preProps: DeviceListQueryProps) {
        if (preProps.refresh > 0 && preProps.refresh !== this.props.refresh) {
            this.setState({
                clauses: [],
                deviceId: ''
            });
        }
    }
}
