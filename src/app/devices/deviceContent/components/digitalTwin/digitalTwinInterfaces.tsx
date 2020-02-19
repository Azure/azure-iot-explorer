/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { DetailsList, IColumn, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';
import { RouteComponentProps, NavLink } from 'react-router-dom';
import { getDigitalTwinComponentNameAndIdsSelector, getDigitalTwinDcmNameSelector, getDigitalTwinInterfacePropertiesWrapperSelector } from '../../selectors';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../../constants/routes';
import { getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { useLocalizationContext } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { getDigitalTwinInterfacePropertiesAction } from '../../actions';
import { HeaderView } from '../../../../shared/components/headerView';
import MultiLineShimmer from '../../../../shared/components/multiLineShimmer';
import { REFRESH } from '../../../../constants/iconNames';
import { LARGE_COLUMN_WIDTH } from '../../../../constants/columnWidth';
import '../../../../css/_digitalTwinNav.scss';
import '../../../../css/_devicePnPDetailList.scss';

export interface DigitalTwinInterfacesProps extends RouteComponentProps{
    isLoading: boolean;
    nameToIds: object;
    dcm: string;
    refresh: (deviceId: string) => void;
}

interface ModelContent {
    link: string;
    componentName: string;
    interfaceId: string;
}

export const DigitalTwinInterfaces: React.FC<DigitalTwinInterfacesProps> = props => {
    if (props.isLoading) {
        return <MultiLineShimmer/>;
    }

    const url = props.match.url;
    const deviceId = getDeviceIdFromQueryString(props);
    const { t } = useLocalizationContext();

    let modelContents: ModelContent[] = [];
    if (props.nameToIds) {
        modelContents = Object.keys(props.nameToIds).map(componentName => {
            const interfaceId = (props.nameToIds as any)[componentName]; // tslint:disable-line:no-any
            const link = `${url}${ROUTE_PARTS.DIGITAL_TWINS_DETAIL}/${ROUTE_PARTS.INTERFACES}/` +
                            `?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}` +
                            `&${ROUTE_PARAMS.COMPONENT_NAME}=${componentName}` +
                            `&${ROUTE_PARAMS.INTERFACE_ID}=${interfaceId}`;

            return { componentName, interfaceId, link };
        });
    }

    const createCommandBarItems = (): ICommandBarItemProps[] => {
        return [
            {
                ariaLabel: t(ResourceKeys.deviceEvents.command.refresh),
                disabled: props.isLoading,
                iconProps: {iconName: REFRESH},
                key: REFRESH,
                name: t(ResourceKeys.deviceEvents.command.refresh),
                onClick: () => props.refresh(deviceId)
            }
        ];
    };

    const getColumns = (): IColumn[] => {
        return [
            { fieldName: 'name', isMultiline: true, isResizable: true, key: 'name',
                maxWidth: LARGE_COLUMN_WIDTH, minWidth: 100, name: t(ResourceKeys.digitalTwin.componentName) },
            { fieldName: 'id', isMultiline: true, isResizable: true, key: 'id',
                maxWidth: LARGE_COLUMN_WIDTH, minWidth: 100, name: t(ResourceKeys.digitalTwin.interfaceId)}
        ];
    };

    const renderItemColumn = () => (item: ModelContent, index: number, column: IColumn) => {
        switch (column.key) {
            case 'name':
                return (
                    <NavLink key={column.key} to={item.link}>
                        {item.componentName}
                    </NavLink>
                );
            case 'id':
                return (
                    <Label
                        key={column.key}
                    >
                        {item.interfaceId}
                    </Label>
                );
            default:
                return;
        }
    };

    return (
        <>
            <CommandBar
                className="command"
                items={createCommandBarItems()}
            />
            <HeaderView
                headerText={ResourceKeys.digitalTwin.headerText}
                link={ResourceKeys.settings.questions.questions.documentation.link}
                tooltip={ResourceKeys.settings.questions.questions.documentation.text}
            />

            <section className="device-detail pnp-detail-list">
                {props.dcm && <Label className="dcm-info">{t(ResourceKeys.digitalTwin.dcm, {modelId: props.dcm })}</Label>}
                {modelContents.length !== 0 &&
                    <div className="list-detail">
                        <DetailsList
                            onRenderItemColumn={renderItemColumn()}
                            items={modelContents}
                            columns={getColumns()}
                            selectionMode={SelectionMode.none}
                        />
                    </div>
                }
            </section>
        </>
    );
};

export type DigitalTwinInterfacesContainerProps = RouteComponentProps;
export const DigitalTwinInterfacesContainer: React.FC<DigitalTwinInterfacesContainerProps> = props => {
    const digitalTwinInterfacesWrapper = useSelector(getDigitalTwinInterfacePropertiesWrapperSelector);
    const dispatch = useDispatch();

    const viewProps = {
        dcm: useSelector(getDigitalTwinDcmNameSelector),
        isLoading: digitalTwinInterfacesWrapper &&
            digitalTwinInterfacesWrapper.synchronizationStatus === SynchronizationStatus.working,
        nameToIds: useSelector(getDigitalTwinComponentNameAndIdsSelector),
        refresh: (deviceId: string) => dispatch(getDigitalTwinInterfacePropertiesAction.started(deviceId)),
        ...props
    };
    return <DigitalTwinInterfaces {...viewProps} />;
};
