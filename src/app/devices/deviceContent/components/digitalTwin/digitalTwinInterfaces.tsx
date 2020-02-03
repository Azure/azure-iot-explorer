/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { RouteComponentProps, NavLink } from 'react-router-dom';
import { getDigitalTwinInterfaceIdToNameMapSelector, getDigitalTwinDcmNameSelector, getDigitalTwinInterfacePropertiesWrapperSelector } from '../../selectors';
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

export interface DigitalTwinInterfacesProps extends RouteComponentProps{
    isLoading: boolean;
    idToNameMap: Map<string, string>;
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

    const navLinks: JSX.Element[] = [];
    if (props.idToNameMap && props.idToNameMap.size > 0) {
        props.idToNameMap.forEach((componentName, interfaceName) => {
            const link = `${url}${ROUTE_PARTS.DIGITAL_TWINS_DETAIL}/${ROUTE_PARTS.INTERFACES}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}&${ROUTE_PARAMS.INTERFACE_ID}=${interfaceName}`;
            navLinks.push(
                <li className="interface-item">
                    <NavLink key={componentName} to={link}>
                        {t(ResourceKeys.digitalTwin.componentName, {componentName})}
                    </NavLink>
                    <Label>{t(ResourceKeys.digitalTwin.interfaceName, {interfaceName})}</Label>
                </li>
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
            <div className="device-detail">
                <Label>{t(ResourceKeys.digitalTwin.dcm, {modelId: props.dcm })}</Label>
                {navLinks}
            </div>
        </>
    );
};

export type DigitalTwinInterfacesContainerProps = RouteComponentProps;
export const DigitalTwinInterfacesContainer: React.FC<DigitalTwinInterfacesContainerProps> = props => {
    const digitalTwinInterfacesWrapper = useSelector(getDigitalTwinInterfacePropertiesWrapperSelector);
    const dispatch = useDispatch();

    const viewProps = {
        dcm: useSelector(getDigitalTwinDcmNameSelector),
        idToNameMap: useSelector(getDigitalTwinInterfaceIdToNameMapSelector),
        isLoading: digitalTwinInterfacesWrapper &&
            digitalTwinInterfacesWrapper.synchronizationStatus === SynchronizationStatus.working,
        refresh: (deviceId: string) => dispatch(getDigitalTwinInterfacePropertiesAction.started(deviceId)),
        ...props
    };
    return <DigitalTwinInterfaces {...viewProps} />;
};
