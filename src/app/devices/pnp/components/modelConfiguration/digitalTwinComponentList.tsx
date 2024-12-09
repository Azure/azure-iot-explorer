/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation, useRouteMatch } from 'react-router-dom';
import { Announced, IColumn, Label, Pivot, PivotItem, SelectionMode } from '@fluentui/react';
import { ResizableDetailsList } from '../../../../shared/resizeDetailsList/resizableDetailsList';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { usePnpStateContext } from '../../context/pnpStateContext';
import { getComponentNameAndInterfaceIdArray } from '../../utils';
import { getDeviceIdFromQueryString, getModuleIdentityIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { ROUTE_PARAMS, ROUTE_PARTS } from '../../../../constants/routes';
import { DEFAULT_COMPONENT_FOR_DIGITAL_TWIN } from '../../../../constants/devices';
import { ErrorBoundary } from '../../../shared/components/errorBoundary';
import { MonacoEditorComponent } from '../../../../shared/components/monacoEditor';
import './digitalTwinDetail.scss';

interface ModelContent {
    link: string;
    componentName: string;
    modelId: string;
}

const jsonViewerHeight = 400;
export const DigitalTwinComponentList: React.FC = () => {
    const { t } = useTranslation();
    const { url } = useRouteMatch();
    const { search } = useLocation();
    const { pnpState } = usePnpStateContext();
    const deviceId = getDeviceIdFromQueryString(search);
    const modelDefinitionWithSource = pnpState.modelDefinitionWithSource.payload;
    const modelDefinition = modelDefinitionWithSource && modelDefinitionWithSource.modelDefinition;
    const twin = pnpState.twin.payload;
    const modelId = twin?.modelId;
    const moduleId = getModuleIdentityIdFromQueryString(search);
    const componentNameToIds = getComponentNameAndInterfaceIdArray(modelDefinition);

    const modelContents: ModelContent[]  = componentNameToIds && componentNameToIds.map(nameToId => {
        let link = `${url}${ROUTE_PARTS.DIGITAL_TWINS_DETAIL}/${ROUTE_PARTS.INTERFACES}/` +
            `?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}` +
            `&${ROUTE_PARAMS.COMPONENT_NAME}=${nameToId.componentName}` +
            `&${ROUTE_PARAMS.INTERFACE_ID}=${nameToId.modelId}`;
        if (moduleId) {
            link += `&${ROUTE_PARAMS.MODULE_ID}=${moduleId}`;
        }

        if (nameToId.componentName === DEFAULT_COMPONENT_FOR_DIGITAL_TWIN && nameToId.modelId === modelId) {
            return{
                componentName: t(ResourceKeys.digitalTwin.pivot.defaultComponent),
                link,
                modelId: nameToId.modelId
            };
        }
        else {
            return {
                ...nameToId,
                link
            };
        }
    });

    const getColumns = (): IColumn[] => {
        return [
            {
                fieldName: 'componentName',
                isMultiline: true,
                key: 'name',
                minWidth: 100,
                name: t(ResourceKeys.digitalTwin.componentName)
            },
            {
                fieldName: 'interfaceId',
                isMultiline: true,
                key: 'id',
                minWidth: 100,
                name: t(ResourceKeys.digitalTwin.interfaceId)
            }
        ];
    };

    const renderItemColumn = (item: ModelContent, index: number, column: IColumn) => {
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
                        {item.modelId}
                    </Label>
                );
            default:
                return <></>;
        }
    };

    const listView = (
        <>
            {
                modelContents.length !== 0 ?
                    <div className="list-detail">
                        <ResizableDetailsList
                            onRenderItemColumn={renderItemColumn}
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
                <PivotItem headerText={t(ResourceKeys.digitalTwin.pivot.content)} className="modelContent">
                    <MonacoEditorComponent
                        height={jsonViewerHeight}
                        content={JSON.stringify(modelDefinitionWithSource.modelDefinition, null, '\t')}
                        ariaLabel={ResourceKeys.digitalTwin.pivot.content}
                    />
                </PivotItem>
            </Pivot>
        </>
    );
};
