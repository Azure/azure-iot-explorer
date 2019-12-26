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
import { CLOSE, REFRESH } from '../../../../constants/iconNames';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { ROUTE_PARTS, ROUTE_PARAMS } from '../../../../constants/routes';
import MaskedCopyableTextFieldContainer from '../../../../shared/components/maskedCopyableTextFieldContainer';
import { GetModuleIdentityTwinActionParameters, GetModuleIdentityActionParameters } from '../../actions';
import { ModuleIdentity } from '../../../../api/models/moduleIdentity';
import { ModuleTwin } from '../../../../api/models/moduleTwin';
import MultiLineShimmer from '../../../../shared/components/multiLineShimmer';
import { DeviceAuthenticationType } from '../../../../api/models/deviceAuthenticationType';
import '../../../../css/_deviceDetail.scss';
// import { getConnectionInfoFromConnectionString } from 'src/app/api/shared/utils';

const EditorPromise = import('react-monaco-editor');
const Editor = React.lazy(() => EditorPromise);

export interface ModuleIdentityDetailDataProps {
    moduleIdentity: ModuleIdentity;
    moduleIdentitySyncStatus: SynchronizationStatus;
    moduleIdentityTwin: ModuleTwin;
    moduleIdentityTwinSyncStatus: SynchronizationStatus;
}

export interface ModuleIdentityDetailDispatchProps {
    getModuleIdentityTwin: (params: GetModuleIdentityTwinActionParameters) => void;
    getModuleIdentity: (params: GetModuleIdentityActionParameters) => void;
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
                                {this.props.moduleIdentitySyncStatus === SynchronizationStatus.working ?
                                    <MultiLineShimmer/> :
                                    this.showModuleIdentity(context)
                                }
                                {this.props.moduleIdentityTwinSyncStatus === SynchronizationStatus.working ?
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
        this.retrieveData();
    }

    public componentDidUpdate(oldProps: ModuleIdentityDetailDataProps & RouteComponentProps) {
        if (getModuleIdentityIdFromQueryString(oldProps) !== getModuleIdentityIdFromQueryString(this.props)) {
            this.retrieveData();
        }
    }

    private readonly retrieveData = () => {
        const deviceId = getDeviceIdFromQueryString(this.props);
        const moduleId = getModuleIdentityIdFromQueryString(this.props);
        this.props.getModuleIdentity({
            deviceId,
            moduleId
        });
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
                        disabled: this.props.moduleIdentityTwinSyncStatus === SynchronizationStatus.working || this.props.moduleIdentitySyncStatus === SynchronizationStatus.working,
                        iconProps: {iconName: REFRESH},
                        key: REFRESH,
                        name: context.t(ResourceKeys.moduleIdentity.detail.command.refresh),
                        onClick: this.retrieveData
                    },
                    {
                        ariaLabel: context.t(ResourceKeys.moduleIdentity.detail.command.back),
                        iconProps: {iconName: CLOSE},
                        key: CLOSE,
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
            />
        );
    }

    // tslint:disable-next-line:cyclomatic-complexity
    private readonly showModuleIdentity = (context: LocalizationContextInterface) => {
        const authType = (this.props.moduleIdentity && this.props.moduleIdentity.authentication.type || DeviceAuthenticationType.None).toLowerCase();

        switch (authType) {
            case DeviceAuthenticationType.SymmetricKey.toLowerCase():
                return this.renderSymmetricKeySection(context);
            case DeviceAuthenticationType.CACertificate.toLowerCase():
                return this.renderCaSection(context);
            case DeviceAuthenticationType.SelfSigned.toLowerCase():
                return this.renderSelfSignedSection(context);
            default:
                return (<></>);
        }
    }

    private readonly renderSymmetricKeySection = (context: LocalizationContextInterface) => {
        return (
            <>
                <MaskedCopyableTextFieldContainer
                    ariaLabel={context.t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.primaryKey)}
                    label={context.t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.primaryKey)}
                    value={this.props.moduleIdentity.authentication.symmetricKey.primaryKey}
                    allowMask={true}
                    t={context.t}
                    readOnly={true}
                    labelCallout={context.t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.primaryKeyTooltip)}
                />

                <MaskedCopyableTextFieldContainer
                    ariaLabel={context.t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.secondaryKey)}
                    label={context.t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.secondaryKey)}
                    value={this.props.moduleIdentity.authentication.symmetricKey.secondaryKey}
                    allowMask={true}
                    t={context.t}
                    readOnly={true}
                    labelCallout={context.t(ResourceKeys.moduleIdentity.authenticationType.symmetricKey.secondaryKeyTooltip)}
                />

                {/* <MaskedCopyableTextFieldContainer
                    ariaLabel={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryConnectionString)}
                    label={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.primaryConnectionString)}
                    value={generateConnectionString(connectionString, identity.deviceId, identity.authentication.symmetricKey.primaryKey)}
                    allowMask={true}
                    t={context.t}
                    readOnly={true}
                />

                <MaskedCopyableTextFieldContainer
                    ariaLabel={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryConnectionString)}
                    label={context.t(ResourceKeys.deviceIdentity.authenticationType.symmetricKey.secondaryConnectionString)}
                    value={generateConnectionString(connectionString, identity.deviceId, identity.authentication.symmetricKey.secondaryKey)}
                    allowMask={true}
                    t={context.t}
                    readOnly={true}
                /> */}
            </>
        );
    }

    private readonly renderCaSection = (context: LocalizationContextInterface) => {
        return (
            <>
                <Label>{context.t(ResourceKeys.moduleIdentity.authenticationType.ca.text)}</Label>
            </>
        );
    }

    private readonly renderSelfSignedSection = (context: LocalizationContextInterface) => {
        return (
            <>
                <Label>{context.t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.text)}</Label>
                <MaskedCopyableTextFieldContainer
                    ariaLabel={context.t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.primaryThumbprint)}
                    label={context.t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.primaryThumbprint)}
                    value={this.props.moduleIdentity.authentication.x509Thumbprint.primaryThumbprint}
                    allowMask={true}
                    t={context.t}
                    readOnly={true}
                    labelCallout={context.t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.primaryThumbprintTooltip)}
                />
                <MaskedCopyableTextFieldContainer
                    ariaLabel={context.t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.secondaryThumbprint)}
                    label={context.t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.secondaryThumbprint)}
                    value={this.props.moduleIdentity.authentication.x509Thumbprint.secondaryThumbprint}
                    allowMask={true}
                    t={context.t}
                    readOnly={true}
                    labelCallout={context.t(ResourceKeys.moduleIdentity.authenticationType.selfSigned.secondaryThumbprintTooltip)}
                />
            </>
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
                                            height="calc(100vh - 700px)"
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
        const path = this.props.match.url.replace(/\/moduleIdentity\/moduleDetail\/.*/, `/${ROUTE_PARTS.MODULE_IDENTITY}`);
        const deviceId = getDeviceIdFromQueryString(this.props);
        this.props.history.push(`${path}/?${ROUTE_PARAMS.DEVICE_ID}=${encodeURIComponent(deviceId)}`);
    }

    // private readonly generateConnectionString = (connectionString: string, deviceId: string, key: string): string => {
    //     const connectionObject = getConnectionInfoFromConnectionString(connectionString);
    //     return connectionObject.hostName && deviceId && key ?
    //         `HostName=${connectionObject.hostName};DeviceId=${deviceId};SharedAccessKey=${key}` : '';
    // };
}
