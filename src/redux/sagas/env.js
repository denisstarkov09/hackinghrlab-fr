import { put, fork, takeLatest, call } from "redux-saga/effects";

import {
  constants as envConstants,
  actions as envActions,
} from "../actions/env-actions";
import { actions as homeActions } from "../actions/home-actions";
import { logout } from "../actions/auth-actions";

import { getEditorSignature } from "../../api";

export function* getEditorSignatureSaga() {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getEditorSignature);

    if (response.status === 200) {
      yield put(envActions.setEditorSignature(response.data.s3Hash));
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

function* watchEnv() {
  yield takeLatest(envConstants.GET_EDITOR_SIGNATURE, getEditorSignatureSaga);
}

export const envSaga = [fork(watchEnv)];
