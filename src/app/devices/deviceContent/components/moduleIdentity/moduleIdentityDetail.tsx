/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { SpinnerSize, Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ThemeContextConsumer, ThemeContextInterface } from '../../../../shared/contexts/themeContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { getDeviceIdFromQueryString, getModuleIdentityIdFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { BACK, REFRESH } from '../../../../constants/iconNames';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../../constants/routes';
import MaskedCopyableTextFieldContainer from '../../../../shared/components/maskedCopyableTextFieldContainer';
import { GetModuleIdentityTwinActionParameters } from '../../actions';
import { ModuleTwin } from '../../../../api/models/moduleIdentity';
import MultiLineShimmer from '../../../../shared/components/multiLineShimmer';
import '../../../../css/_deviceDetail.scss';

const EditorPromise = import('react-monaco-editor');
const Editor = React.lazy(() => EditorPromise);

export interface ModuleIdentityDetailDataProps {
    synchronizationStatus: SynchronizationStatus;
    moduleIdentityTwin: ModuleTwin;
}

export interface ModuleIdentityDetailDispatchProps {
    getModuleIdentityTwin: (params: GetModuleIdentityTwinActionParameters) => void;
}

export default class ModuleIdentityDetailComponent
    extends React.Component<ModuleIdentityDetailDataProps & ModuleIdentityDetailDispatchProps & RouteComponentProps> {

    public render(): JSX.Element {
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <>
                        {this.showCommandBar(context)}
                        <h3>{context.t(ResourceKeys.moduleIdentity.detail.headerText)}</h3>
                        <div className="device-detail">
                            <div className="module-identity">
                                {this.showModuleId(context)}
                                {this.props.synchronizationStatus === SynchronizationStatus.working ?
                                    <MultiLineShimmer/> :
                                    this.showModuleTwin(context)
                                }
                            </div>
                        </div>
                    </>
            )}
            </LocalizationContextConsumer>
        );
    }

    public componentDidMount() {
        this.props.getModuleIdentityTwin({
            deviceId: getDeviceIdFromQueryString(this.props),
            moduleId: getModuleIdentityIdFromQueryString(this.props)
        });
    }

    public componentDidUpdate(oldProps: ModuleIdentityDetailDataProps & RouteComponentProps) {
        if (getModuleIdentityIdFromQueryString(oldProps) !== getModuleIdentityIdFromQueryString(this.props)) {
            this.props.getModuleIdentityTwin({
                deviceId: getDeviceIdFromQueryString(this.props),
                moduleId: getModuleIdentityIdFromQueryString(this.props)
            });
        }
    }

    private readonly showCommandBar = (context: LocalizationContextInterface) => {
        return (
            <CommandBar
                className="command"
                items={[
                    {
                        ariaLabel: context.t(ResourceKeys.moduleIdentity.detail.command.refresh),
                        disabled: this.props.synchronizationStatus === SynchronizationStatus.working,
                        iconProps: {iconName: REFRESH},
                        key: REFRESH,
                        name: context.t(ResourceKeys.moduleIdentity.detail.command.refresh),
                        onClick: () => this.props.getModuleIdentityTwin({
                            deviceId: getDeviceIdFromQueryString(this.props),
                            moduleId: getModuleIdentityIdFromQueryString(this.props)
                        })
                    },
                    {
                        ariaLabel: context.t(ResourceKeys.moduleIdentity.detail.command.back),
                        iconProps: {iconName: BACK},
                        key: BACK,
                        name: context.t(ResourceKeys.moduleIdentity.detail.command.back),
                        onClick: this.navigateToModuleList
                    },
                ]}
            />
        );
    }

    private readonly showModuleId = (context: LocalizationContextInterface) => {
        return (
            <MaskedCopyableTextFieldContainer
                ariaLabel={context.t(ResourceKeys.moduleIdentity.moduleId)}
                label={context.t(ResourceKeys.moduleIdentity.moduleId)}
                value={getModuleIdentityIdFromQueryString(this.props)}
                allowMask={false}
                t={context.t}
                readOnly={true}
                labelCallout={context.t(ResourceKeys.moduleIdentity.moduleIdTooltip)}
                setFocus={true}
            />
        );
    }

    private readonly showModuleTwin = (context: LocalizationContextInterface) => {
        return (
            <>
            { this.props.moduleIdentityTwin &&
                    <>
                        <Label>{context.t(ResourceKeys.moduleIdentity.detail.twin)}</Label>
                        <div className="monaco-editor">
                            <React.Suspense fallback={<Spinner title={'loading'} size={SpinnerSize.large} />}>
                                <ThemeContextConsumer>
                                    {(themeContext: ThemeContextInterface) => (
                                        <Editor
                                            language="json"
                                            height="calc(100vh - 400px)"
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
                    </>
                }
            </>
        );
    }

    private readonly navigateToModuleList = () => {
        const path = this.props.match.url.replace(/\/moduleIdentity\/detail\/.*/, `/${ROUTE_PARTS.MODULE_IDENTITY}`);
        const deviceId = getDeviceIdFromQueryString(this.props);
        this.props.history.push(`${path}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`);
    }
}
