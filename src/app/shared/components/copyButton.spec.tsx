import * as React from 'react';
import { act, create } from 'react-test-renderer';
import { IconButton } from '@fluentui/react';
import { shallow } from 'enzyme';
import { CopyButton } from './copyButton';

describe('copyToClipboard', () => {
    it('matches snapshot', () => {
        expect(shallow(<CopyButton copyText='text'/>)).toMatchSnapshot();
    });

    it('matches snapshot disabled', () => {
        expect(shallow(<CopyButton copyText='text' disabled={true}/>)).toMatchSnapshot();
    });

    it('executes copyToClipboard', async () => {
        const wrapper = create(
            <CopyButton copyText='text'/>,
            {
                createNodeMock: (element: React.ReactElement) => {
                    if (element.type === 'input') {
                        return {
                            select: () => {}
                        };
                    }
                    return null;
                }
            });

        act(() => {
            const clipboardButton = wrapper.root.findByType(IconButton);
            clipboardButton.props.onClick(undefined);
        });

        expect(document.execCommand).toHaveBeenLastCalledWith('copy');
    });
});