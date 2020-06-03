/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { DetailsList, IColumn, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Announced } from 'office-ui-fabric-react/lib/Announced';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { NavLink, useLocation } from 'react-router-dom';
import { getDigitalTwinModelId,
    getDigitalTwinSynchronizationStatusSelector,
    getComponentNameAndInterfaceIdArraySelector,
    getModelDefinitionSyncStatusSelector,
    getModelDefinitionWithSourceSelector,
    defaultComponentKey } from '../../selectors';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../../constants/routes';
import { getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { useLocalizationContext } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { getDigitalTwinAction, getModelDefinitionAction } from '../../actions';
import { REFRESH } from '../../../../constants/iconNames';
import { LARGE_COLUMN_WIDTH } from '../../../../constants/columnWidth';
import { ModelDefinitionWithSource } from '../../../../api/models/modelDefinitionWithSource';
import { InterfaceNotFoundMessageBar } from '../shared/interfaceNotFoundMessageBar';
import { ModelDefinitionSourceView } from '../shared/modelDefinitionSource';
import { MaskedCopyableTextField } from '../../../../shared/components/maskedCopyableTextField';
import { MonacoEditorView } from '../../../../shared/components/monacoEditor';
import { HeaderView } from '../../../../shared/components/headerView';
import MultiLineShimmer from '../../../../shared/components/multiLineShimmer';
import { ComponentAndInterfaceId } from '../../../../shared/utils/jsonSchemaAdaptor';
import '../../../../css/_digitalTwinInterfaces.scss';

export interface DigitalTwinInterfacesProps {
    isDigitalTwinLoading: boolean;
    isModelDefinitionLoading: boolean;
    modelDefinitionWithSource: ModelDefinitionWithSource;
    modelId: string;
    componentNameToIds: ComponentAndInterfaceId[];
}

interface ModelContent {
    link: string;
    componentName: string;
    interfaceId: string;
}

export const DigitalTwinInterfaces: React.FC<DigitalTwinInterfacesProps> = props => {
    const { pathname, search } = useLocation();
    const deviceId = getDeviceIdFromQueryString(search);
    const { t } = useLocalizationContext();
    const { modelId, componentNameToIds, modelDefinitionWithSource } = props;
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (!modelId) {
            return;
        }
        dispatch(getModelDefinitionAction.started({digitalTwinId: deviceId, interfaceId: modelId}));
    },              [modelId]);

    const modelContents: ModelContent[]  = componentNameToIds && componentNameToIds.map(nameToId => {
        const link = `${pathname}${ROUTE_PARTS.DIGITAL_TWINS_DETAIL}/${ROUTE_PARTS.INTERFACES}/` +
            `?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}` +
            `&${ROUTE_PARAMS.COMPONENT_NAME}=${nameToId.componentName}` +
            `&${ROUTE_PARAMS.INTERFACE_ID}=${nameToId.interfaceId}`;
        if (nameToId.componentName === defaultComponentKey && nameToId.interfaceId === props.modelId) {
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
                disabled: props.isDigitalTwinLoading,
                iconProps: {iconName: REFRESH},
                key: REFRESH,
                name: t(ResourceKeys.deviceEvents.command.refresh),
                // tslint:disable-next-line:no-any
                onClick: () =>  dispatch(getDigitalTwinAction.started(deviceId)) as any
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
                                items={modelContents}
                                columns={getColumns()}
                                selectionMode={SelectionMode.none}
                            />
                        </div> :
                        <>
                            <Label className="no-component">{t(ResourceKeys.digitalTwin.modelContainsNoComponents, {modelId: props.modelId })}</Label>
                            <Announced
                                message={t(ResourceKeys.digitalTwin.modelContainsNoComponents, {modelId: props.modelId })}
                            />
                        </>
                }
            </>);

        return (
            <>
                <h4>{t(ResourceKeys.digitalTwin.steps.third)}</h4>
                <h5>{t(ResourceKeys.digitalTwin.steps.explanation, {modelId: props.modelId})}</h5>
                <Pivot aria-label={t(ResourceKeys.digitalTwin.pivot.ariaLabel)}>
                    <PivotItem headerText={t(ResourceKeys.digitalTwin.pivot.components)}>
                        {listView}
                    </PivotItem>
                    <PivotItem headerText={t(ResourceKeys.digitalTwin.pivot.content)}>
                        <MonacoEditorView
                            className="interface-definition-monaco-editor"
                            content={modelDefinitionWithSource.modelDefinition}
                        />
                    </PivotItem>
                </Pivot>
            </>
        );
    };

    const renderModelDefinition = () => {
        if (props.isModelDefinitionLoading) {
            return <MultiLineShimmer/>;
        }

        if (!modelDefinitionWithSource) {
            return (
            <>
                <h4>{t(ResourceKeys.digitalTwin.steps.secondFailure)}</h4>
                <InterfaceNotFoundMessageBar/>
            </>);
        }

        return (
            <>
                <h4>{t(ResourceKeys.digitalTwin.steps.secondSuccess)}</h4>
                <ModelDefinitionSourceView
                    source={props.modelDefinitionWithSource.source}
                />
                {modelDefinitionWithSource.isModelValid ?
                    renderComponentList() :
                    <>
                        <MessageBar messageBarType={MessageBarType.error}>
                            {t(ResourceKeys.deviceInterfaces.interfaceNotValid)}
                        </MessageBar>
                        <MonacoEditorView
                            className="interface-definition-monaco-editor"
                            content={modelDefinitionWithSource.modelDefinition}
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
            {props.isDigitalTwinLoading ?
                <MultiLineShimmer/> :
                <section className="device-detail">
                    <h4>{t(ResourceKeys.digitalTwin.steps.first)}</h4>
                    <MaskedCopyableTextField
                        ariaLabel={t(ResourceKeys.digitalTwin.modelId)}
                        label={t(ResourceKeys.digitalTwin.modelId)}
                        value={props.modelId}
                        allowMask={false}
                        readOnly={true}
                    />
                    {renderModelDefinition()}
            </section>}
        </>
    );
};

export const DigitalTwinInterfacesContainer: React.FC = () => {
    const digitalTwinSynchronizationStatus = useSelector(getDigitalTwinSynchronizationStatusSelector);
    const modelDefinitionSynchronizationStatus = useSelector(getModelDefinitionSyncStatusSelector);

    const viewProps = {
        componentNameToIds: useSelector(getComponentNameAndInterfaceIdArraySelector),
        isDigitalTwinLoading: digitalTwinSynchronizationStatus === SynchronizationStatus.working,
        isModelDefinitionLoading: modelDefinitionSynchronizationStatus === SynchronizationStatus.working,
        modelDefinitionWithSource: useSelector(getModelDefinitionWithSourceSelector),
        modelId: useSelector(getDigitalTwinModelId),
    };
    return <DigitalTwinInterfaces {...viewProps} />;
};
