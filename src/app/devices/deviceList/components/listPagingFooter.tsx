import * as React from 'react';

export interface ListPagingFooterDataProps {
    continuationTokens: string[];
    currentPageIndex: number;
}
export interface ListPagingFooterDispatchProps {
    fetchPage: (pageNumber: number) => void;
}
export default class ListPagingFooterComponent extends React.Component<ListPagingFooterDataProps & ListPagingFooterDispatchProps> {
    constructor(props: ListPagingFooterDataProps & ListPagingFooterDispatchProps) {
        super(props);
    }

    public render() {
        const { continuationTokens } = this.props;
        debugger; //tslint:disable-line
        return (
            (continuationTokens && continuationTokens.length > 0 && this.renderSection()) || <></>
        );
    }

    private readonly renderSection = () => {
        return(
            <section role="navigation">
                <ul role="list">
                    {this.props.continuationTokens.map(this.renderListItem)}
                </ul>
            </section>
        );
    }

    private readonly renderListItem = (continuationToken: string, index: number) => {
        const fetchPage = () => {
            this.props.fetchPage(index);
        };

        return (
            <li
                role="listItem"
                className={index === this.props.currentPageIndex ? 'selected' : ''}
                onClick={index !== this.props.currentPageIndex && fetchPage}
            >
                {index + 1}
            </li>
        );
    }
}
