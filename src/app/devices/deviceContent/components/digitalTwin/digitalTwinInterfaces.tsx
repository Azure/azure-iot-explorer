/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { RouteComponentProps, NavLink } from 'react-router-dom';
import { getDigitalTwincomponentNameAndIdsSelector, getDigitalTwinDcmNameSelector, getDigitalTwinInterfacePropertiesWrapperSelector } from '../../selectors';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../../constants/routes';
import { getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { useLocalizationContext } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { getDigitalTwinInterfacePropertiesAction } from '../../actions';
import { HeaderView } from '../../../../shared/components/headerView';
import MultiLineShimmer from '../../../../shared/components/multiLineShimmer';
import { REFRESH } from '../../../../constants/iconNames';
import '../../../../css/_digitalTwinNav.scss';
import '../../../../css/_devicePnPDetailList.scss';

export interface DigitalTwinInterfacesProps extends RouteComponentProps{
    isLoading: boolean;
    nameToIds: object;
    dcm: string;
    refresh: (deviceId: string) => void;
}

export const DigitalTwinInterfaces: React.FC<DigitalTwinInterfacesProps> = props => {
    if (props.isLoading) {
        return <MultiLineShimmer/>;
    }

    const url = props.match.url;
    const deviceId = getDeviceIdFromQueryString(props);
    const { t } = useLocalizationContext();

    let navLinks: JSX.Element[] = [];
    if (props.nameToIds) {
        navLinks = Object.keys(props.nameToIds).map(componentName => {
            const interfaceId = (props.nameToIds as any)[componentName]; // tslint:disable-line:no-any
            const link = `${url}${ROUTE_PARTS.DIGITAL_TWINS_DETAIL}/${ROUTE_PARTS.INTERFACES}/` +
                            `?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}` +
                            `&${ROUTE_PARAMS.COMPONENT_NAME}=${componentName}` +
                            `&${ROUTE_PARAMS.INTERFACE_ID}=${interfaceId}`;

            return (
                <div className="interface-item ms-Grid-row" key={componentName}>
                    <NavLink className="ms-Grid-col ms-sm3 ms-md3 ms-lg3" key={componentName} to={link}>
                        {componentName}
                    </NavLink>
                    <Label className="ms-Grid-col ms-sm3 ms-md3 ms-lg3 interface-info" >{interfaceId}</Label>
                </div>
            );
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

            <section className="device-detail pnp-detail-list scrollable-lg">
                {props.dcm && <Label className="dcm-info">{t(ResourceKeys.digitalTwin.dcm, {modelId: props.dcm })}</Label>}

                <div className="ms-Grid">
                    <div className="interface-item ms-Grid-row">
                        <Label className="ms-Grid-col ms-sm3 ms-md3 ms-lg3 grid-header" >{t(ResourceKeys.digitalTwin.componentName)}</Label>
                        <Label className="ms-Grid-col ms-sm3 ms-md3 ms-lg3 grid-header" >{t(ResourceKeys.digitalTwin.interfaceId)}</Label>
                    </div>
                    {navLinks}
                </div>
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
        nameToIds: useSelector(getDigitalTwincomponentNameAndIdsSelector),
        refresh: (deviceId: string) => dispatch(getDigitalTwinInterfacePropertiesAction.started(deviceId)),
        ...props
    };
    return <DigitalTwinInterfaces {...viewProps} />;
};
