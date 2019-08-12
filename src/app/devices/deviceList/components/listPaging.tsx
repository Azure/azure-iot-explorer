/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Link } from 'office-ui-fabric-react';
import '../../../css/_deviceListPaging.scss';
import { LocalizationContextConsumer, LocalizationContextInterface } from '../../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../../localization/resourceKeys';

export interface ListPagingDataProps {
    continuationTokens: string[];
    currentPageIndex: number;
}
export interface ListPagingDispatchProps {
    fetchPage: (pageNumber: number) => void;
}
export default class ListPagingComponent extends React.Component<ListPagingDataProps & ListPagingDispatchProps> {
    constructor(props: ListPagingDataProps & ListPagingDispatchProps) {
        super(props);
    }

    public render() {
        const { continuationTokens } = this.props;
        return (
            (continuationTokens && continuationTokens.length > 0 && this.renderSection()) || <></>
        );
    }

    private readonly renderSection = () => {
        return (
            <LocalizationContextConsumer>
                {(context: LocalizationContextInterface) => (
                    <section role="navigation" className="grid-paging">
                        <span className="pages">{context.t(ResourceKeys.deviceLists.paging.pages)}</span>
                        <ul role="list">
                            {this.props.continuationTokens.map(this.renderListItem)}
                        </ul>
                    </section>
                )}
            </LocalizationContextConsumer>
        );
    }

    private readonly renderListItem = (continuationToken: string, index: number) => {
        const fetchPage = () => {
            this.props.fetchPage(index);
        };

        return (
            <li
                key={`page_${index}`}
                role="listitem"
                className={index === this.props.currentPageIndex ? 'selected' : ''}
            >
                {index !== this.props.currentPageIndex ?
                    (<Link
                        onClick={fetchPage}
                    >
                        {index === this.props.continuationTokens.length - 1 ? '»' : index + 1}
                    </Link>) :
                    (<span>{index + 1}</span>)
                }
            </li>
        );
    }
}
