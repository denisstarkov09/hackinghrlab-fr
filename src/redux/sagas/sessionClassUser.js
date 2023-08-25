import { put, fork, takeLatest, call } from "redux-saga/effects";

import { actions as sessionActions } from "../actions/session-actions";

import {
  constants as sessionClassUserConstants,
  actions as sessionClassUserActions,
} from "../actions/session-class-user-action";
import { logout } from "../actions/auth-actions";
import { actions as homeActions } from "../actions/home-actions";
import { setProgress, getUserProgress } from "../../api";

export function* getSessionUserProgressSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  const { sessionId, type } = payload.sessionId

  try {
    const response = yield call(getUserProgress, { sessionId: sessionId, type: type });

    if (response.status === 200) {
      yield put(
        sessionClassUserActions.setSessionUserProgress(
          response.data.annualConferenceClassUser
        )
      );
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

export function* setSessionProgressSaga({ payload }) {
  try {
    let response = yield call(setProgress, payload.data);
    if (response.status === 200) {
      response = yield call(getUserProgress, { sessionId: payload.data.sessionId, type: payload.data.type });
      if (response.status === 200) {
        yield put(
          sessionClassUserActions.setSessionUserProgress(
            response.data.annualConferenceClassUser
          )
        );
      }

      yield put(sessionActions.getSession(payload.data.sessionId, payload.data.type));
    }
  } catch (error) {
    console.log(error);
  }
}

function* watchLogin() {
  yield takeLatest(
    sessionClassUserConstants.GET_SESSION_USER_PROGRESS,
    getSessionUserProgressSaga
  );
  yield takeLatest(
    sessionClassUserConstants.SET_SESSION_PROGRESS,
    setSessionProgressSaga
  );
}

export const sessionClassUserSaga = [fork(watchLogin)];
