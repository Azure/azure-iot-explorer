/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from 'office-ui-fabric-react/lib/components/Label';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/components/CommandBar';
import { DetailsList, IColumn, SelectionMode } from 'office-ui-fabric-react/lib/components/DetailsList';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/components/MessageBar';
import { Announced } from 'office-ui-fabric-react/lib/components/Announced';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/components/Pivot';
import { Link } from 'office-ui-fabric-react/lib/components/Link';
import { NavLink, useLocation, useRouteMatch } from 'react-router-dom';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../constants/routes';
import { getDeviceIdFromQueryString } from '../../../shared/utils/queryStringHelper';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { getDeviceTwinAction } from '../actions';
import { REFRESH } from '../../../constants/iconNames';
import { LARGE_COLUMN_WIDTH } from '../../../constants/columnWidth';
import { InterfaceNotFoundMessageBar } from '../../shared/components/interfaceNotFoundMessageBar';
import { ModelDefinitionSourceView } from '../../shared/components/modelDefinitionSource';
import { MaskedCopyableTextField } from '../../../shared/components/maskedCopyableTextField';
import { JSONEditor } from '../../../shared/components/jsonEditor';
import { HeaderView } from '../../../shared/components/headerView';
import { MultiLineShimmer } from '../../../shared/components/multiLineShimmer';
import { usePnpStateContext } from '../../../shared/contexts/pnpStateContext';
import { ModelDefinition } from '../../../api/models/modelDefinition';
import { ComponentAndInterfaceId, JsonSchemaAdaptor } from '../../../shared/utils/jsonSchemaAdaptor';
import { DEFAULT_COMPONENT_FOR_DIGITAL_TWIN } from '../../../constants/devices';
import { ErrorBoundary } from '../../shared/components/errorBoundary';
import '../../../css/_digitalTwinInterfaces.scss';

interface ModelContent {
    link: string;
    componentName: string;
    interfaceId: string;
}

const getComponentNameAndInterfaceIdArray = (modelDefinition: ModelDefinition): ComponentAndInterfaceId[] => {
    if (!modelDefinition) {
        return [];
    }
    const jsonSchemaAdaptor = new JsonSchemaAdaptor(modelDefinition);
    const components = jsonSchemaAdaptor.getComponentNameAndInterfaceIdArray();
    // check if model contains no-component items
    if (jsonSchemaAdaptor.getNonWritableProperties().length +
        jsonSchemaAdaptor.getWritableProperties().length +
        jsonSchemaAdaptor.getCommands().length +
        jsonSchemaAdaptor.getTelemetry().length > 0) {
        components.unshift({
            componentName: DEFAULT_COMPONENT_FOR_DIGITAL_TWIN,
            interfaceId: modelDefinition['@id']
        });
    }
    return components;
};

// tslint:disable-next-line: cyclomatic-complexity
export const DigitalTwinInterfacesList: React.FC = () => {
    const { search } = useLocation();
    const { url } = useRouteMatch();
    const deviceId = getDeviceIdFromQueryString(search);
    const { t } = useTranslation();

    const { pnpState, dispatch, } = usePnpStateContext();
    const modelDefinitionWithSource = pnpState.modelDefinitionWithSource.payload;
    const modelDefinition = modelDefinitionWithSource && modelDefinitionWithSource.modelDefinition;
    const twin = pnpState.twin.payload;
    const twinSynchronizationStatus = pnpState.twin.synchronizationStatus;
    const modelDefinitionSynchronizationStatus = pnpState.modelDefinitionWithSource.synchronizationStatus;
    const isModelDefinitionLoading = modelDefinitionSynchronizationStatus === SynchronizationStatus.working;
    const isTwinLoading = twinSynchronizationStatus === SynchronizationStatus.working;
    const modelId = twin?.modelId;
    const componentNameToIds = getComponentNameAndInterfaceIdArray(modelDefinition);

    const onRefresh = (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement>) => {
        dispatch(getDeviceTwinAction.started(deviceId));
    };

    const modelContents: ModelContent[]  = componentNameToIds && componentNameToIds.map(nameToId => {
        const link = `${url}${ROUTE_PARTS.DIGITAL_TWINS_DETAIL}/${ROUTE_PARTS.INTERFACES}/` +
            `?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}` +
            `&${ROUTE_PARAMS.COMPONENT_NAME}=${nameToId.componentName}` +
            `&${ROUTE_PARAMS.INTERFACE_ID}=${nameToId.interfaceId}`;
        if (nameToId.componentName === DEFAULT_COMPONENT_FOR_DIGITAL_TWIN && nameToId.interfaceId === modelId) {
            return{
                componentName: t(ResourceKeys.digitalTwin.pivot.defaultComponent),
                interfaceId: nameToId.interfaceId,
                link
            };
        }
        else {
            return {
                ...nameToId,
                link
            };
        }
    });

    const createCommandBarItems = (): ICommandBarItemProps[] => {
        return [
            {
                ariaLabel: t(ResourceKeys.deviceEvents.command.refresh),
                disabled: isTwinLoading,
                iconProps: {iconName: REFRESH},
                key: REFRESH,
                name: t(ResourceKeys.deviceEvents.command.refresh),
                onClick: onRefresh
            }
        ];
    };

    const getColumns = (): IColumn[] => {
        return [
            { fieldName: 'componentName', isMultiline: true, isResizable: true, key: 'name',
                maxWidth: LARGE_COLUMN_WIDTH, minWidth: 100, name: t(ResourceKeys.digitalTwin.componentName) },
            { fieldName: 'interfaceId', isMultiline: true, isResizable: true, key: 'id',
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

    const renderComponentList = () => {
        const listView = (
            <>
                {
                    modelContents.length !== 0 ?
                        <div className="list-detail">
                            <DetailsList
                                onRenderItemColumn={renderItemColumn()}
                                className="component-list"
                                items={modelContents}
                                columns={getColumns()}
                                selectionMode={SelectionMode.none}
                            />
                        </div> :
                        <>
                            <Label className="no-component">{t(ResourceKeys.digitalTwin.modelContainsNoComponents, {modelId })}</Label>
                            <Announced
                                message={t(ResourceKeys.digitalTwin.modelContainsNoComponents, { modelId })}
                            />
                        </>
                }
            </>);

        return (
            <>
                <h4>{t(ResourceKeys.digitalTwin.steps.third)}</h4>
                <h5>{t(ResourceKeys.digitalTwin.steps.explanation, {modelId})}</h5>
                <Pivot aria-label={t(ResourceKeys.digitalTwin.pivot.ariaLabel)}>
                    <PivotItem headerText={t(ResourceKeys.digitalTwin.pivot.components)}>
                        <ErrorBoundary error={t(ResourceKeys.deviceInterfaces.interfaceListFailedToRender)}>
                            {listView}
                        </ErrorBoundary>
                    </PivotItem>
                    <PivotItem headerText={t(ResourceKeys.digitalTwin.pivot.content)}>
                        <JSONEditor
                            className="interface-definition-json-editor"
                            content={JSON.stringify(modelDefinitionWithSource.modelDefinition, null, '\t')}
                        />
                    </PivotItem>
                </Pivot>
            </>
        );
    };

    const renderModelDefinition = () => {
        if (isModelDefinitionLoading) {
            return <MultiLineShimmer/>;
        }

        if (!modelDefinitionWithSource) {
            return (
            <>
                <h4>{t(ResourceKeys.digitalTwin.steps.secondFailure, {modelId})}</h4>
                <InterfaceNotFoundMessageBar/>
            </>);
        }

        return (
            <>
                <h4>{t(ResourceKeys.digitalTwin.steps.secondSuccess)}</h4>
                <ModelDefinitionSourceView
                    source={modelDefinitionWithSource.source}
                />
                {modelDefinitionWithSource.isModelValid ?
                    renderComponentList() :
                    <>
                        <MessageBar messageBarType={MessageBarType.error}>
                            {t(ResourceKeys.deviceInterfaces.interfaceNotValid)}
                        </MessageBar>
                        <JSONEditor
                            className="interface-definition-json-editor"
                            content={JSON.stringify(modelDefinitionWithSource.modelDefinition, null, '\t')}
                        />
                    </>
                }
            </>
        );
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
            {isTwinLoading ?
                <MultiLineShimmer/> :
                <section className="device-detail">
                    {modelId ?
                        <>
                            <h4>{t(ResourceKeys.digitalTwin.steps.first)}</h4>
                            <MaskedCopyableTextField
                                ariaLabel={t(ResourceKeys.digitalTwin.modelId)}
                                label={t(ResourceKeys.digitalTwin.modelId)}
                                value={modelId}
                                allowMask={false}
                                readOnly={true}
                            />
                            {renderModelDefinition()}
                        </> :
                        <>
                            <span>{t(ResourceKeys.digitalTwin.steps.zero)}</span>
                            <Link
                                href={t(ResourceKeys.settings.questions.questions.documentation.link)}
                                target="_blank"
                            >
                                {t(ResourceKeys.settings.questions.questions.documentation.text)}
                            </Link>
                        </>
                    }
                </section>
            }
        </>
    );
};
