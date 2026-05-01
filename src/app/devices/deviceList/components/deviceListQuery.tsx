/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '@fluentui/react-components';
import { ArrowForwardRegular, FilterRegular, SearchRegular } from '@fluentui/react-icons';
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

    const onSetDeviceId = (event: React.ChangeEvent<HTMLInputElement>, data: { value: string }) => {
        setClauses([]);
        setDeviceId(data.value);
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
                <Input
                    appearance="underline"
                    placeholder={t(ResourceKeys.deviceLists.query.deviceId.placeholder)}
                    aria-label={t(ResourceKeys.deviceLists.query.deviceId.ariaLabel)}
                    className="search-box"
                    role="searchbox"
                    onKeyUp={onDeviceIdKeyUp}
                    value={deviceId}
                    onChange={onSetDeviceId}
                    contentBefore={<SearchRegular />}
                    style={{ border: 'none', flexGrow: 1 }}
                />
                <Button
                    appearance="subtle"
                    className="search-button"
                    icon={<ArrowForwardRegular />}
                    onClick={setQueryFromSearchBoxAndExecute}
                    title={t(ResourceKeys.deviceLists.query.deviceId.searchButton.title)}
                    aria-label={t(ResourceKeys.deviceLists.query.deviceId.searchButton.ariaLabel)}
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
                {clauses && clauses.length > 0 && <Button
                    appearance="primary"
                    className="search-pill"
                    onClick={setQueryFromQueryPillsAndExecute}
                    aria-label={t(ResourceKeys.deviceLists.query.searchPills.search.ariaLabel)}
                >
                    {t(ResourceKeys.deviceLists.query.searchPills.search.text)}
                </Button>}
                <Button
                    appearance="transparent"
                    className="search-pill"
                    icon={<FilterRegular />}
                    onClick={onAddClause}
                    aria-label={t(ResourceKeys.deviceLists.query.searchPills.add.ariaLabel)}
                >
                    {t(ResourceKeys.deviceLists.query.searchPills.add.text)}
                </Button>
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
