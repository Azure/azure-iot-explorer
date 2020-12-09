/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from 'office-ui-fabric-react/lib/components/TextField';
import { ActionButton, IconButton, PrimaryButton } from 'office-ui-fabric-react/lib/components/Button';
import { DeviceQueryClause } from './deviceQueryClause';
import { DeviceQuery, QueryClause } from '../../../api/models/deviceQuery';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import '../../../css/_deviceListQuery.scss';

export interface DeviceListQueryProps {
    refresh: number;
    setQueryAndExecute: (query: DeviceQuery, executeQuery?: boolean) => void;
}

export const DeviceListQuery: React.FC<DeviceListQueryProps> = (props: DeviceListQueryProps) => {
    const { t } = useTranslation();

    const { refresh, setQueryAndExecute } = props;
    const [ clauses, setClauses ] = React.useState([]);
    const [ deviceId, setDeviceId ] = React.useState('');

    React.useEffect(() => {
        if (refresh > 0) {
            setClauses(clauses);
            setDeviceId('');
        }

    },              [refresh]);

    const removePill = (index: number) => {
        const newClauses = [...clauses];
        newClauses.splice(index, 1);
        setClauses(newClauses);
    };

    const setClause = (index: number, clause: QueryClause) => {
        const newClauses = [...clauses];
        newClauses[index] = clause;
        setClauses(newClauses);
    };

    const onAddClause = () => {
        setClauses( [...clauses, { isError: true }]);
        setDeviceId('');
    };

    const onDeviceIdKeyUp = (arg: {key: string}) => {
        if (arg && 'Enter' === arg.key) {
            setQueryFromSearchBoxAndExecute();
        }
    };

    const onSetDeviceId = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setClauses([]);
        setDeviceId(newValue);
    };

    const setQueryFromSearchBoxAndExecute = () => {
        setQueryAndExecute(
            {
                clauses: [],
                continuationTokens: [],
                currentPageIndex: 0,
                deviceId
            }
        );
    };

    const setQueryFromQueryPillsAndExecute = () => {
        setQueryAndExecute(
            {
                clauses,
                continuationTokens: [],
                currentPageIndex: 0,
                deviceId: ''
            }
        );
    };

    const renderIdSearch = () => {
        return (
            <div className="deviceId-search">
                <TextField
                    borderless={true}
                    placeholder={t(ResourceKeys.deviceLists.query.deviceId.placeholder)}
                    ariaLabel={t(ResourceKeys.deviceLists.query.deviceId.ariaLabel)}
                    className="search-box"
                    iconProps={{ iconName: 'Search' }}
                    role="searchbox"
                    onKeyUp={onDeviceIdKeyUp}
                    value={deviceId}
                    onChange={onSetDeviceId}
                />
                <IconButton
                    className="search-button"
                    iconProps={{ iconName: 'Forward' }}
                    type="submit"
                    onClick={setQueryFromSearchBoxAndExecute}
                    title={t(ResourceKeys.deviceLists.query.deviceId.searchButton.title)}
                    ariaLabel={t(ResourceKeys.deviceLists.query.deviceId.searchButton.ariaLabel)}
                    disabled={!!clauses && clauses.length > 0}
                />
            </div>
        );
    };

    const renderClauses = () => {
        return (
            <div className="clauses">
                {(clauses || []).map((clause, index) => <DeviceQueryClause
                    key={`query_clause:${index}`}
                    index={index}
                    operation={clause.operation}
                    parameterType={clause.parameterType}
                    removeClause={removePill}
                    setClause={setClause}
                    value={clause.value}
                />)}
                {clauses && clauses.length > 0 && <PrimaryButton
                    className="search-pill"
                    onClick={setQueryFromQueryPillsAndExecute}
                    ariaLabel={t(ResourceKeys.deviceLists.query.searchPills.search.ariaLabel)}
                >
                    {t(ResourceKeys.deviceLists.query.searchPills.search.text)}
                </PrimaryButton>}
                <ActionButton
                    className="search-pill"
                    iconProps={{ iconName: 'Filter' }}
                    type="button"
                    onClick={onAddClause}
                    ariaLabel={t(ResourceKeys.deviceLists.query.searchPills.add.ariaLabel)}
                >
                    {t(ResourceKeys.deviceLists.query.searchPills.add.text)}
                </ActionButton>
            </div>
        );
    };

    return (
        <section role="search" className="deviceList-query">
            {renderIdSearch()}
            {renderClauses()}
        </section>
    );
};
