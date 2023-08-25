import { put, fork, takeLatest, call } from "redux-saga/effects";

import {
  constants as postCommentConstants,
  actions as postCommentActions,
} from "../actions/post-comment-actions";
import { actions as homeActions } from "../actions/home-actions";
import { logout } from "../actions/auth-actions";
import { getAllComments, post, remove } from "../../api/module/postComment";

export function* getAllCommentsSaga({ payload }) {
  if (payload.page === 1) {
    yield put(homeActions.setLoading(true));
  } else {
    yield put(postCommentActions.setLoading(true));
  }
  try {
    const response = yield call(getAllComments, payload);

    if (response.status === 200) {
      yield put(
        postCommentActions.setAllComments(
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
    yield put(postCommentActions.setLoading(false));
    yield put(homeActions.setLoading(false));
  }
}

export function* addPostCommentSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(post, payload.comment);
    if (response.status === 200) {
      yield put(
        postCommentActions.getAllComments({ postId: payload.comment.PostId })
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

export function* removePostCommentSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(remove, payload.comment);
    if (response.status === 200) {
      yield put(
        postCommentActions.getAllComments({ postId: payload.comment.PostId })
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
  yield takeLatest(postCommentConstants.GET_ALL_COMMENTS, getAllCommentsSaga);
  yield takeLatest(postCommentConstants.ADD_COMMENT, addPostCommentSaga);
  yield takeLatest(postCommentConstants.DELETE_COMMENT, removePostCommentSaga);
}

export const postCommentSaga = [fork(watchLogin)];
