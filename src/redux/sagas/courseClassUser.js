import { put, fork, takeLatest, call } from "redux-saga/effects";

import {
  actions as courseActions,
} from "../actions/course-actions";

import {
  constants as courseClassUserConstants,
  actions as courseClassUserActions,
} from "../actions/course-user-progress-actions";
import { actions as homeActions } from "../actions/home-actions";
import {
  setProgress,
  getUserProgress,
} from "../../api/module/courseClassUser";

export function* getCourseUserProgressSaga({payload}) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getUserProgress, payload.courseId);

    if (response.status === 200) {
      yield put(courseClassUserActions.setCourseUserProgress(response.data.courseClassUser));
    }

    yield put(homeActions.setLoading(false));
  } catch (error) {
    console.log(error);
    yield put(homeActions.setLoading(false));
  }
}

export function* setProgressSaga({payload}) {
  try {
    let response = yield call(setProgress, payload.data);
    if (response.status === 200) {
      response = yield call(getUserProgress, payload.data.courseId);
      if (response.status === 200) {
        yield put(courseClassUserActions.setCourseUserProgress(response.data.courseClassUser));
      }
      yield put(courseActions.getCourse(payload.data.courseId));
    }

  } catch (error) {
    console.log(error);
  }
}

function* watchLogin() {
  yield takeLatest(courseClassUserConstants.GET_COURSE_USER_PROGRESS, getCourseUserProgressSaga);
  yield takeLatest(courseClassUserConstants.SET_PROGRESS, setProgressSaga);
}

export const courseClassUserSaga = [fork(watchLogin)];
