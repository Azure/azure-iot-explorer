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
import { RouteComponentProps, NavLink } from 'react-router-dom';
import { getDigitalTwinModelId,
    getDigitalTwinSynchronizationStatusSelector,
    ComponentAndInterfaceId,
    getComponentNameAndInterfaceIdArraySelector,
    getModelDefinitionSyncStatusSelector,
    getModelDefinitionWithSourceSelector } from '../../selectors';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../../constants/routes';
import { getDeviceIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { useLocalizationContext } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { getDigitalTwinAction, getModelDefinitionAction } from '../../actions';
import { REFRESH } from '../../../../constants/iconNames';
import { LARGE_COLUMN_WIDTH } from '../../../../constants/columnWidth';
import { ModelDefinitionWithSource } from '../../../../api/models/modelDefinitionWithSource';
import InterfaceNotFoundMessageBoxContainer from '../shared/interfaceNotFoundMessageBarContainer';
import { ModelDefinitionSourceView } from '../shared/modelDefinitionSource';
import MaskedCopyableTextFieldContainer from '../../../../shared/components/maskedCopyableTextFieldContainer';
import { MonacoEditorView } from '../../../../shared/components/monacoEditor';
import { HeaderView } from '../../../../shared/components/headerView';
import MultiLineShimmer from '../../../../shared/components/multiLineShimmer';
import { setSettingsVisibilityAction } from '../../../../settings/actions';
import '../../../../css/_digitalTwinInterfaces.scss';

export interface DigitalTwinInterfacesProps extends RouteComponentProps{
    isDigitalTwinLoading: boolean;
    isModelDefinitionLoading: boolean;
    modelDefinitionWithSource: ModelDefinitionWithSource;
    modelId: string;
    componentNameToIds: ComponentAndInterfaceId[];
    retrieveDigitalTwin: (deviceId: string) => void;
    retrieveComponents: (deviceId: string, interfaceId: string) => void;
    settingsVisibleToggle: (visible: boolean) => void;
}

interface ModelContent {
    link: string;
    componentName: string;
    interfaceId: string;
}

export const DigitalTwinInterfaces: React.FC<DigitalTwinInterfacesProps> = props => {
    const url = props.match.url;
    const deviceId = getDeviceIdFromQueryString(props);
    const { t } = useLocalizationContext();
    const { modelId, componentNameToIds, retrieveComponents, modelDefinitionWithSource } = props;

    React.useEffect(() => {
        if (!modelId) {
            return;
        }
        retrieveComponents(deviceId, modelId);
    }, [modelId]); // tslint:disable-line:align

    const modelContents: ModelContent[]  = componentNameToIds && componentNameToIds.map(nameToId => {
            const link = `${url}${ROUTE_PARTS.DIGITAL_TWINS_DETAIL}/${ROUTE_PARTS.INTERFACES}/` +
                            `?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}` +
                            `&${ROUTE_PARAMS.COMPONENT_NAME}=${nameToId.componentName}` +
                            `&${ROUTE_PARAMS.INTERFACE_ID}=${nameToId.interfaceId}`;

            return { ...nameToId, link };
    });

    const createCommandBarItems = (): ICommandBarItemProps[] => {
        return [
            {
                ariaLabel: t(ResourceKeys.deviceEvents.command.refresh),
                disabled: props.isDigitalTwinLoading,
                iconProps: {iconName: REFRESH},
                key: REFRESH,
                name: t(ResourceKeys.deviceEvents.command.refresh),
                onClick: () =>  props.retrieveDigitalTwin(deviceId)
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

    const handleConfigure = () => {
       props.settingsVisibleToggle(true);
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
                <InterfaceNotFoundMessageBoxContainer/>
            </>);
        }

        return (
            <>
                <h4>{t(ResourceKeys.digitalTwin.steps.secondSuccess)}</h4>
                <ModelDefinitionSourceView
                    handleConfigure={handleConfigure}
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
                    <MaskedCopyableTextFieldContainer
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

export type DigitalTwinInterfacesContainerProps = RouteComponentProps;
export const DigitalTwinInterfacesContainer: React.FC<DigitalTwinInterfacesContainerProps> = props => {
    const digitalTwinSynchronizationStatus = useSelector(getDigitalTwinSynchronizationStatusSelector);
    const modelDefinitionSynchronizationStatus = useSelector(getModelDefinitionSyncStatusSelector);
    const dispatch = useDispatch();

    const viewProps = {
        componentNameToIds: useSelector(getComponentNameAndInterfaceIdArraySelector),
        isDigitalTwinLoading: digitalTwinSynchronizationStatus === SynchronizationStatus.working,
        isModelDefinitionLoading: modelDefinitionSynchronizationStatus === SynchronizationStatus.working,
        modelDefinitionWithSource: useSelector(getModelDefinitionWithSourceSelector),
        modelId: useSelector(getDigitalTwinModelId),
        retrieveComponents: (deviceId: string, interfaceId: string) => dispatch(getModelDefinitionAction.started({digitalTwinId: deviceId, interfaceId})),
        retrieveDigitalTwin: (deviceId: string) => dispatch(getDigitalTwinAction.started(deviceId)),
        settingsVisibleToggle: (visible: boolean) => dispatch(setSettingsVisibilityAction(visible)),
        ...props
    };
    return <DigitalTwinInterfaces {...viewProps} />;
};
