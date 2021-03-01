import 'jest';
import { takeLatest, takeEvery, all } from 'redux-saga/effects';
import { getModuleIdentityTwinSaga } from './sagas/getModuleIdentityTwinSaga';
import { updateModuleIdentityTwinSaga } from './sagas/updateModuleIdentityTwinSaga';
import { moduleIdentityTwinSagas } from './saga';
import { getModuleIdentityTwinAction, updateModuleIdentityTwinAction } from './actions';

describe('moduleIndentityTwin/saga/rootSaga', () => {
    it('returns specified sagas', () => {
        expect(moduleIdentityTwinSagas().next().value).toEqual(all([
            takeLatest(getModuleIdentityTwinAction.started.type, getModuleIdentityTwinSaga),
            takeEvery(updateModuleIdentityTwinAction.started.type, updateModuleIdentityTwinSaga)
        ]));
    });
});
