import { put, fork, takeLatest, call } from "redux-saga/effects";

import {
  constants as councilCommentConstants,
  actions as councilCommentActions,
} from "../actions/council-comments-actions";
import { actions as homeActions } from "../actions/home-actions";
import { logout } from "../actions/auth-actions";
import {
  getAllCouncilCommentsFromAPI,
  postCouncilCommentFromAPI,
  removeCouncilCommentFromAPI,
} from "../../api/module/council-comments";

export function* getAllCouncilCommentsSaga({ payload }) {
  if (payload.page === 1) {
    yield put(homeActions.setLoading(true));
  } else {
    yield put(councilCommentActions.setLoading(true));
  }
  try {
    const response = yield call(getAllCouncilCommentsFromAPI, payload);
    if (response.status === 200) {
      yield put(
        councilCommentActions.setAllCouncilComments(
          response.data.comments.count,
          payload.page || 1,
          response.data.comments.rows
        )
      );
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  } finally {
    yield put(councilCommentActions.setLoading(false));
    yield put(homeActions.setLoading(false));
  }
}

export function* addCouncilCommentSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(postCouncilCommentFromAPI, payload.comment);
    if (response.status === 200) {
      yield put(
        councilCommentActions.getAllCouncilComments({
          councilId: payload.comment.CouncilId,
        })
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

export function* removeCouncilCommentSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(removeCouncilCommentFromAPI, payload.comment);
    if (response.status === 200) {
      yield put(
        councilCommentActions.getAllCouncilComments({
          councilId: payload.comment.CouncilId,
        })
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

function* watchLogin() {
  yield takeLatest(
    councilCommentConstants.GET_ALL_COUNCIL_COMMENTS,
    getAllCouncilCommentsSaga
  );
  yield takeLatest(
    councilCommentConstants.ADD_COUNCIL_COMMENT,
    addCouncilCommentSaga
  );
  yield takeLatest(
    councilCommentConstants.DELETE_COUNCIL_COMMENT,
    removeCouncilCommentSaga
  );
}

export const councilCommentSaga = [fork(watchLogin)];
