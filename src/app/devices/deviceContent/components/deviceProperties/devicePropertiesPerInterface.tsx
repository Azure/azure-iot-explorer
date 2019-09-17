/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Overlay } from 'office-ui-fabric-react/lib/Overlay';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import DevicePropertiesPerInterfacePerProperty, { TwinWithSchema } from './devicePropertiesPerInterfacePerProperty';

export interface DevicePropertiesDataProps {
    twinAndSchema: TwinWithSchema[];
}

export interface DevicePropertiesState {
    showOverlay: boolean;
}

export default class DevicePropertiesPerInterface
    extends React.Component<DevicePropertiesDataProps, DevicePropertiesState> {
    constructor(props: DevicePropertiesDataProps) {
        super(props);

        this.state = {
            showOverlay: false
        };
    }

    public render(): JSX.Element {

        const { twinAndSchema } = this.props;
        const properties = twinAndSchema && twinAndSchema.map((item, indexInner) => (
                <DevicePropertiesPerInterfacePerProperty
                    key={indexInner}
                    {...item}
                    handleOverlayToggle={this.handleOverlayToggle}
                />
            ));
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <div className="pnp-detail-list scrollable-lg ms-Grid">
                        <div className="list-header list-header-uncollapsible ms-Grid-row">
                            <span className="ms-Grid-col ms-u-sm3">{context.t(ResourceKeys.deviceProperties.columns.name)}</span>
                            <span className="ms-Grid-col ms-u-sm3">{context.t(ResourceKeys.deviceProperties.columns.schema)}</span>
                            <span className="ms-Grid-col ms-u-sm3">{context.t(ResourceKeys.deviceProperties.columns.unit)}</span>
                            <span className="ms-Grid-col ms-u-sm3">{context.t(ResourceKeys.deviceProperties.columns.value)}</span>
                        </div>
                        <section role={twinAndSchema && twinAndSchema.length === 0 ? 'main' : 'list'} className="list-content">
                            {properties}
                        </section>
                        {this.state.showOverlay && <Overlay/>}
                    </div>
                )}
            </LocalizationContextConsumer>
        );
    }

    private readonly handleOverlayToggle = () => {
        this.setState({showOverlay: !this.state.showOverlay});
    }
}
