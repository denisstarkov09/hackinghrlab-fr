import { put, fork, call, takeLatest } from "redux-saga/effects";
import { notification } from "antd";

import {
  constants as jobBoardConstants,
  actions as jobBoardActions,
} from "../actions/jobBoard-actions";

import {
  getAllJobPosts,
  getJobPost,
  upsertJobPost,
  getMyJobPosts,
  invitationToApply,
} from "../../api";

import { actions as homeActions } from "../actions/home-actions";

export function* getAllJobPostsSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getAllJobPosts, { ...payload });

    if (response.status === 200) {
      yield put(
        jobBoardActions.setAllJobPosts(
          response.data.allJobPosts.count,
          1,
          response.data.allJobPosts.rows
        )
      );
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* getJobPostSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getJobPost, { ...payload });

    if (response.status === 200) {
      yield put(jobBoardActions.setJobPost(response.data.jobPost));
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* getMoreJobPostsSaga({ payload }) {
  yield put(jobBoardActions.setLoadingJobBoard(true));

  try {
    const response = yield call(getAllJobPosts, { ...payload });

    if (response.status === 200) {
      yield put(
        jobBoardActions.setMoreJobPosts(
          response.data.allJobPosts.count,
          payload.filter.page,
          response.data.allJobPosts.rows
        )
      );
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(jobBoardActions.setLoadingJobBoard(false));
  }
}

export function* upsertJobPostSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(upsertJobPost, { ...payload });

    if (response.status === 200) {
      yield put(jobBoardActions.setMyJobPosts(response.data.myJobPosts));

      notification.success({
        message: "Success",
      });
    }
  } catch (error) {
    console.log(error);
    notification.error({
      message: "Error",
      description: "Something went wrong",
    });
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* getMyJobPostsSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getMyJobPosts, { ...payload });

    if (response.status === 200) {
      yield put(jobBoardActions.setMyJobPosts(response.data.myJobPosts));
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* invitationToApplySaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(invitationToApply, { ...payload });

    if (response.status === 200) {
      notification.success({
        message: "Success",
      });
    }
  } catch (error) {
    notification.error({
      message: "Something went wrong.",
    });
    console.log(error);
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

function* watchJobBoardSaga() {
  yield takeLatest(jobBoardConstants.GET_ALL_JOB_POSTS, getAllJobPostsSaga);
  yield takeLatest(jobBoardConstants.GET_JOB_POST, getJobPostSaga);
  yield takeLatest(jobBoardConstants.GET_MORE_JOB_POSTS, getMoreJobPostsSaga);
  yield takeLatest(jobBoardConstants.UPSERT_JOB_POST, upsertJobPostSaga);
  yield takeLatest(jobBoardConstants.GET_MY_JOB_POSTS, getMyJobPostsSaga);
  yield takeLatest(
    jobBoardConstants.INVITATION_TO_APPLY,
    invitationToApplySaga
  );
}

export const jobBoardSaga = [fork(watchJobBoardSaga)];
