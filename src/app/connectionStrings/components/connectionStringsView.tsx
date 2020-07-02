/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { CommandBar } from 'office-ui-fabric-react/lib/components/CommandBar';
import { ConnectionString  } from './connectionString';
import { ConnectionStringEditView } from './connectionStringEditView';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { CONNECTION_STRING_LIST_MAX_LENGTH } from '../../constants/browserStorage';
import { upsertConnectionStringAction, deleteConnectionStringAction, setConnectionStringsAction, getConnectionStringAction } from '../actions';
import { ROUTE_PARTS } from '../../constants/routes';
import { formatConnectionStrings } from '../../shared/utils/hubConnectionStringHelper';
import { ConnectionStringsEmpty } from './connectionStringsEmpty';
import { useAsyncSagaReducer } from '../../shared/hooks/useAsyncSagaReducer';
import { connectionStringsReducer } from '../reducer';
import { connectionStringsSaga } from '../sagas';
import { connectionStringsStateInitial } from '../state';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';
import { MultiLineShimmer } from '../../shared/components/multiLineShimmer';
import { getConnectionInfoFromConnectionString } from '../../api/shared/utils';
import '../../css/_layouts.scss';
import './connectionStringsView.scss';

// tslint:disable-next-line: cyclomatic-complexity
export const ConnectionStringsView: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();

    const [ localState, dispatch ] = useAsyncSagaReducer(connectionStringsReducer, connectionStringsSaga, connectionStringsStateInitial(), 'connectionStringsState');
    const [ connectionStringUnderEdit, setConnectionStringUnderEdit ] = React.useState<string>(undefined);

    const connectionStrings = localState.payload;
    const synchronizationStatus = localState.synchronizationStatus;

    const onUpsertConnectionString = (newConnectionString: string, connectionString?: string) => {
        dispatch(upsertConnectionStringAction.started({newConnectionString, connectionString}));
    };

    const onDeleteConnectionString = (connectionString: string) => {
        dispatch(deleteConnectionStringAction.started(connectionString));
    };

    const onSelectConnectionString = (connectionString: string) => {
        const updatedConnectionStrings = formatConnectionStrings(connectionStrings, connectionString);
        dispatch(setConnectionStringsAction.started(updatedConnectionStrings));
    };

    const onAddConnectionStringClick = () => {
        setConnectionStringUnderEdit('');
    };

    const onEditConnectionStringClick = (connectionString: string) => {
        setConnectionStringUnderEdit(connectionString);
    };

    const onConnectionStringEditCommit = (connectionString: string) => {
        onUpsertConnectionString(connectionString, connectionStringUnderEdit);
        setConnectionStringUnderEdit(undefined);
    };

    const onConnectionStringEditDismiss = () => {
        setConnectionStringUnderEdit(undefined);
    };

    React.useEffect(() => {
        dispatch(getConnectionStringAction.started());
    },              []);

    React.useEffect(() => {
        if (synchronizationStatus === SynchronizationStatus.upserted) { // only when connection string updated successfully would navigate to device list view
            const hostName = getConnectionInfoFromConnectionString(connectionStrings[0]).hostName;
            history.push(`/${ROUTE_PARTS.RESOURCE}/${hostName}/${ROUTE_PARTS.DEVICES}`);
        }
    },              [synchronizationStatus]);

    if (synchronizationStatus === SynchronizationStatus.updating || synchronizationStatus === SynchronizationStatus.working) {
        return (
            <MultiLineShimmer/>
        );
    }

    return (
        <div className="view">
            <div className="view-command">
                <CommandBar
                    items={[
                        {
                            ariaLabel: t(ResourceKeys.connectionStrings.addConnectionCommand.ariaLabel),
                            disabled: connectionStrings.length >= CONNECTION_STRING_LIST_MAX_LENGTH,
                            iconProps: { iconName: 'Add' },
                            key: 'add',
                            onClick: onAddConnectionStringClick,
                            text: t(ResourceKeys.connectionStrings.addConnectionCommand.label)
                        }
                    ]}
                />
            </div>
            <div className="view-scroll-vertical">
                <div className="connection-strings">
                    {connectionStrings.map(connectionString =>
                        <ConnectionString
                            key={connectionString}
                            connectionString={connectionString}
                            onEditConnectionString={onEditConnectionStringClick}
                            onDeleteConnectionString={onDeleteConnectionString}
                            onSelectConnectionString={onSelectConnectionString}
                        />
                    )}
                </div>

                {(!connectionStrings || connectionStrings.length === 0) &&
                    <ConnectionStringsEmpty/>
                }

            </div>
            {connectionStringUnderEdit !== undefined &&
                <ConnectionStringEditView
                    connectionStringUnderEdit={connectionStringUnderEdit}
                    connectionStrings={connectionStrings}
                    onDismiss={onConnectionStringEditDismiss}
                    onCommit={onConnectionStringEditCommit}
                />
            }
        </div>
    );
};
