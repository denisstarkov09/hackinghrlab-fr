import { put, fork, takeLatest, call } from "redux-saga/effects";

import {
  constants as mentoringConstants,
  actions as mentoringActions,
} from "../actions/mentoring-actions";
import { logout } from "../actions/auth-actions";
import { actions as homeActions } from "../actions/home-actions";

import {
  setMentorInfo,
  getMentoringInfo,
  updateMentorInfo,
  getMentorList,
  getMenteeList,
  setMatch,
} from "../../api";

export function* setMentoringInfoSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(setMentorInfo, { ...payload });

    if (response.status === 200) {
      yield put(mentoringActions.saveMentoringInfo([response.data.mentorInfo]));
      yield put(homeActions.updateUserInformation(response.data.user));
      if (payload.callback) {
        payload.callback();
      }
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

export function* updateMentoringInfoSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(updateMentorInfo, { ...payload });

    if (response.status === 200) {
      yield put(mentoringActions.saveMentoringInfo(response.data.mentorInfo));
      if (payload.callback) {
        payload.callback();
      }
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

export function* getMentoringInfoSaga() {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getMentoringInfo);

    if (response.status === 200 && response.data.mentoringInfo) {
      yield put(
        mentoringActions.saveMentoringInfo(response.data.mentoringInfo)
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

export function* getMentorListSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getMentorList, { ...payload });

    if (response.status === 200) {
      const data = response.data.mentorList;
      yield put(
        mentoringActions.setMentorList(
          data && data.length > 0 ? data[0].total : 0,
          1,
          data
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

export function* getMoreMentorListSaga({ payload }) {
  yield put(mentoringActions.setMentorLoading(true));

  try {
    const response = yield call(getMentorList, { ...payload });

    if (response.status === 200) {
      const data = response.data.mentorList;
      yield put(
        mentoringActions.setMentorList(
          data && data.length > 0 ? data[0].total : 0,
          payload.filter.page,
          data
        )
      );
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  } finally {
    yield put(mentoringActions.setMentorLoading(false));
  }
}

export function* getMenteeListSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getMenteeList, { ...payload });

    if (response.status === 200) {
      const data = response.data.menteeList;
      yield put(
        mentoringActions.setMenteeList(
          data && data.length > 0 ? data[0].total : 0,
          1,
          data
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

export function* getMoreMenteeListSaga({ payload }) {
  yield put(mentoringActions.setMenteeLoading(true));

  try {
    const response = yield call(getMenteeList, { ...payload });

    if (response.status === 200) {
      const data = response.data.menteeList;
      yield put(
        mentoringActions.setMenteeList(
          data && data.length > 0 ? data[0].total : 0,
          payload.filter.page,
          data
        )
      );
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  } finally {
    yield put(mentoringActions.setMenteeLoading(false));
  }
}

export function* setMatchSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(setMatch, { ...payload });

    if (response.status === 200) {
      yield put(
        mentoringActions.saveMentoringInfo([response.data.affectedRows])
      );
      yield put(mentoringActions.updateMatch(response.data.affectedRows));
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

function* watchMentoring() {
  yield takeLatest(mentoringConstants.SET_MENTORING_INFO, setMentoringInfoSaga);
  yield takeLatest(
    mentoringConstants.UPDATE_MENTORING_INFO,
    updateMentoringInfoSaga
  );
  yield takeLatest(mentoringConstants.GET_MENTOR_LIST, getMentorListSaga);
  yield takeLatest(
    mentoringConstants.GET_MORE_MENTOR_LIST,
    getMoreMentorListSaga
  );
  yield takeLatest(mentoringConstants.GET_MENTEE_LIST, getMenteeListSaga);
  yield takeLatest(
    mentoringConstants.GET_MORE_MENTEE_LIST,
    getMoreMenteeListSaga
  );
  yield takeLatest(mentoringConstants.GET_MENTORING_INFO, getMentoringInfoSaga);
  yield takeLatest(mentoringConstants.SET_MATCH, setMatchSaga);
}

export const mentoringSaga = [fork(watchMentoring)];
