/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { RouteComponentProps, Route } from 'react-router-dom';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { SpinnerSize, Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ThemeContextConsumer, ThemeContextInterface } from '../../../../shared/contexts/themeContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString, getModuleIdentityIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { REFRESH, NAVIGATE_BACK } from '../../../../constants/iconNames';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../../constants/routes';
import { GetModuleIdentityTwinActionParameters } from '../../actions';
import { ModuleTwin } from '../../../../api/models/moduleTwin';
import MultiLineShimmer from '../../../../shared/components/multiLineShimmer';
import { ModuleIdentityDetailHeaderContainer } from './moduleIdentityDetailHeaderView';
import '../../../../css/_deviceDetail.scss';
import '../../../../css/_moduleIdentityDetail.scss';

const EditorPromise = import('react-monaco-editor');
const Editor = React.lazy(() => EditorPromise);

export interface ModuleIdentityTwinDataProps {
    moduleIdentityTwin: ModuleTwin;
    moduleIdentityTwinSyncStatus: SynchronizationStatus;
}

export interface ModuleIdentityTwinDispatchProps {
    getModuleIdentityTwin: (params: GetModuleIdentityTwinActionParameters) => void;
}

export type ModuleIdentityDetailProps = ModuleIdentityTwinDataProps & ModuleIdentityTwinDispatchProps;
export default class ModuleIdentityDetailComponent
    extends React.Component<ModuleIdentityDetailProps & RouteComponentProps> {

    public render(): JSX.Element {
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <>
                        {this.showCommandBar(context)}
                        <Route component={ModuleIdentityDetailHeaderContainer} />
                        <div className="module-identity-detail">
                            {this.props.moduleIdentityTwinSyncStatus === SynchronizationStatus.working ?
                                <MultiLineShimmer/> :
                                this.showModuleTwin()
                            }
                        </div>
                    </>
                )}
            </LocalizationContextConsumer>
        );
    }

    public componentDidMount() {
        this.retrieveData();
    }

    public componentDidUpdate(oldProps: ModuleIdentityTwinDataProps & RouteComponentProps) {
        if (getModuleIdentityIdFromQueryString(oldProps) !== getModuleIdentityIdFromQueryString(this.props)) {
            this.retrieveData();
        }
    }

    private readonly retrieveData = () => {
        const deviceId = getDeviceIdFromQueryString(this.props);
        const moduleId = getModuleIdentityIdFromQueryString(this.props);
        this.props.getModuleIdentityTwin({
            deviceId,
            moduleId
        });
    }

    private readonly showCommandBar = (context: LocalizationContextInterface) => {
        return (
            <CommandBar
                className="command"
                items={[
                    {
                        ariaLabel: context.t(ResourceKeys.moduleIdentity.detail.command.refresh),
                        disabled: this.props.moduleIdentityTwinSyncStatus === SynchronizationStatus.working,
                        iconProps: {iconName: REFRESH},
                        key: REFRESH,
                        name: context.t(ResourceKeys.moduleIdentity.detail.command.refresh),
                        onClick: this.retrieveData
                    }
                ]}
                farItems={[
                    {
                        ariaLabel: context.t(ResourceKeys.moduleIdentity.detail.command.back),
                        iconProps: {iconName: NAVIGATE_BACK},
                        key: NAVIGATE_BACK,
                        name: context.t(ResourceKeys.moduleIdentity.detail.command.back),
                        onClick: this.navigateToModuleList
                    }
                ]}
            />
        );
    }

    private readonly showModuleTwin = () => {
        return (
            <>
                {this.props.moduleIdentityTwin &&
                    <div className="monaco-editor">
                        <React.Suspense fallback={<Spinner title={'loading'} size={SpinnerSize.large} />}>
                            <ThemeContextConsumer>
                                {(themeContext: ThemeContextInterface) => (
                                    <Editor
                                        language="json"
                                        value={JSON.stringify(this.props.moduleIdentityTwin, null, '\t')}
                                        options={{
                                            automaticLayout: true,
                                            readOnly: true
                                        }}
                                        theme={themeContext.monacoTheme}
                                    />
                                )}
                            </ThemeContextConsumer>
                        </React.Suspense>
                    </div>
                }
            </>
        );
    }

    private readonly navigateToModuleList = () => {
        const path = this.props.match.url.replace(/\/moduleIdentity\/moduleTwin\/.*/, `/${ROUTE_PARTS.MODULE_IDENTITY}`);
        const deviceId = getDeviceIdFromQueryString(this.props);
        this.props.history.push(`${path}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`);
    }
}
