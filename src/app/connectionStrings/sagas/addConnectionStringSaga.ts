import { Action } from 'typescript-fsa';
import { select } from 'redux-saga/effects';
import { CONNECTION_STRING_NAME_LIST, CONNECTION_STRING_LIST_MAX_LENGTH } from '../../constants/browserStorage';
import { StateInterface } from '../../shared/redux/state';

export function* addConnectionStringSaga(action: Action<string>): Iterable<void> {
    const savedStrings = localStorage.getItem(CONNECTION_STRING_NAME_LIST);
    if (savedStrings) {
        const savedNames = savedStrings.split(',').filter(name => name !== action.payload); // remove duplicates
        const updatedNames = [action.payload, ...savedNames].slice(0, CONNECTION_STRING_LIST_MAX_LENGTH);
        localStorage.setItem(CONNECTION_STRING_NAME_LIST, updatedNames.join(','));
    }
    else {
        localStorage.setItem(CONNECTION_STRING_NAME_LIST, action.payload);
    }
}
