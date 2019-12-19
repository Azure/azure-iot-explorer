import { Action } from 'typescript-fsa';
import { CONNECTION_STRING_NAME_LIST } from '../../constants/browserStorage';

export function* deleteConnectionStringSaga(action: Action<string>): Iterable<void> {
    const savedStrings = localStorage.getItem(CONNECTION_STRING_NAME_LIST);
    if (savedStrings) {
        const savedNames = savedStrings.split(',').filter(name => name !== action.payload); // remove duplicates
        const updatedNames = savedNames.filter(s => s !== action.payload);
        localStorage.setItem(CONNECTION_STRING_NAME_LIST, updatedNames.join(','));
    }
}
