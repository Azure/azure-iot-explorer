/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { DetailsList, IColumn, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { REFRESH } from '../../../../constants/iconNames';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { ModuleIdentityListWrapper } from '../../../../api/models/moduleIdentityListWrapper';
import { parseDateTimeString } from '../../../../api/dataTransforms/transformHelper';
import { RenderMultiLineShimmer } from '../../../../shared/components/multiLineShimmer';
import '../../../../css/_deviceDetail.scss';

export interface ModuleIdentityDataProps {
    moduleIdentityListWrapper: ModuleIdentityListWrapper;
}

export interface ModuleIdentityDispatchProps {
    getModuleIdentities: (deviceId: string) => void;
}

export default class ModuleIdentity
    extends React.Component<ModuleIdentityDataProps & ModuleIdentityDispatchProps & RouteComponentProps> {

    public render(): JSX.Element {
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <>
                        {this.showCommandBar(context)}
                        <h3>{context.t(ResourceKeys.deviceTwin.headerText)}</h3>
                        {this.renderTwinViewer()}
                    </>
            )}
            </LocalizationContextConsumer>
        );
    }

    public componentDidMount() {
        this.props.getModuleIdentities(getDeviceIdFromQueryString(this.props));
    }

    private readonly showCommandBar = (context: LocalizationContextInterface) => {
        return (
            <CommandBar
                className="command"
                items={[
                    {
                        ariaLabel: context.t(ResourceKeys.deviceTwin.command.refresh),
                        iconProps: {iconName: REFRESH},
                        key: REFRESH,
                        name: context.t(ResourceKeys.deviceTwin.command.refresh),
                        onClick: this.handleRefresh
                    }
                ]}
            />
        );
    }

    private readonly handleRefresh = () => {
        this.props.getModuleIdentities(getDeviceIdFromQueryString(this.props));
    }

    // tslint:disable
    private readonly renderTwinViewer = () => {
        const { moduleIdentityListWrapper } = this.props;
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <div className="device-detail">
                        <DetailsList
                            columns={this.getColumns(context)}
                            items={moduleIdentityListWrapper ? moduleIdentityListWrapper.moduleIdentities : []}
                            selectionMode={SelectionMode.none}
                        />

                        {(
                            moduleIdentityListWrapper &&
                            moduleIdentityListWrapper.synchronizationStatus === SynchronizationStatus.working) &&
                            RenderMultiLineShimmer()
                        }

                        {(
                            moduleIdentityListWrapper &&
                            moduleIdentityListWrapper.synchronizationStatus === SynchronizationStatus.fetched &&
                            moduleIdentityListWrapper.moduleIdentities.length === 0) &&
                            <div>{context.t(ResourceKeys.deviceTwin.command.refresh)}</div>
                        }

                        {(
                            moduleIdentityListWrapper &&
                            moduleIdentityListWrapper.synchronizationStatus === SynchronizationStatus.failed) &&
                                <div>{context.t(ResourceKeys.deviceTwin.command.refresh)}</div>
                    }
                    </div>
                )}
            </LocalizationContextConsumer>);
    }

    private getColumns(localizationContext: LocalizationContextInterface): IColumn[] {
        const { t } = localizationContext;
        const columns: IColumn[] = [
            {
                ariaLabel: t(ResourceKeys.moduleIdentity.columns.moduleId),
                fieldName: 'moduleId',
                isResizable: true,
                key: 'moduleId',
                maxWidth: 200,
                minWidth: 50,
                name: t(ResourceKeys.moduleIdentity.columns.moduleId)
            },
            {
                ariaLabel: t(ResourceKeys.moduleIdentity.columns.connectionState),
                fieldName: 'connectionState',
                isResizable: true,
                key: 'connectionState',
                maxWidth: 200,
                minWidth: 50,
                name: t(ResourceKeys.moduleIdentity.columns.connectionState)
            },
            {
                ariaLabel: t(ResourceKeys.moduleIdentity.columns.connectionStateLastUpdated),
                fieldName: 'connectionStateLastUpdated',
                isResizable: true,
                key: 'connectionStateLastUpdated',
                maxWidth: 250,
                minWidth: 150,
                name: t(ResourceKeys.moduleIdentity.columns.connectionStateLastUpdated),
                onRender: item => parseDateTimeString(item.connectionStateUpdatedTime)
            },
            {
                ariaLabel: t(ResourceKeys.moduleIdentity.columns.lastActivityTime),
                fieldName: 'lastActivityTime',
                key: 'lastActivityTime',
                maxWidth: 250,
                minWidth: 150,
                name: t(ResourceKeys.moduleIdentity.columns.lastActivityTime),
                onRender: item => parseDateTimeString(item.lastActivityTime)
            }];

        return columns;
    }
}
