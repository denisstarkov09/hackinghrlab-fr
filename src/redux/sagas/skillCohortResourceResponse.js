import { put, fork, call, takeLatest } from "redux-saga/effects";
import { notification } from "antd";

import {
  constants as responseConstants,
  actions as responseActions,
} from "../actions/skillCohortResourceResponse-actions";
import { actions as homeActions } from "../actions/home-actions";

import {
  getAllResourceResponses,
  createResourceResponse,
  getResourceResponse,
  updateResourceResponse,
} from "../../api";

export function* getAllResourceResponsesSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getAllResourceResponses, { ...payload });

    if (response.status === 200) {
      yield put(
        responseActions.setAllResourceResponse(
          response.data.allSkillCohortResourceResponses
        )
      );
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* getResourceResponseSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getResourceResponse, { ...payload });

    if (response.status === 200) {
      yield put(
        responseActions.setResourceResponse(
          response.data.skillCohortResourceResponse
        )
      );
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* createResourceResponseSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(createResourceResponse, { ...payload });

    if (response.status === 200) {
      notification.success({
        message: "Success",
        description: "Successfully submitted your response.",
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

export function* updateResourceResponseSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(updateResourceResponse, { ...payload });

    if (response.status === 200) {
      notification.success({
        message: "Success",
        description: "Successfully updated your response.",
      });

      yield put(
        responseActions.setResourceResponse(response.data.affectedRows)
      );
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

function* watchResponseSaga() {
  yield takeLatest(
    responseConstants.GET_ALL_RESOURCE_RESPONSES,
    getAllResourceResponsesSaga
  );
  yield takeLatest(
    responseConstants.CREATE_RESOURCE_RESPONSE,
    createResourceResponseSaga
  );
  yield takeLatest(
    responseConstants.GET_RESOURCE_RESPONSE,
    getResourceResponseSaga
  );
  yield takeLatest(
    responseConstants.UPDATE_RESOURCE_RESPONSE,
    updateResourceResponseSaga
  );
}

export const skillCohortResourceResponseSaga = [fork(watchResponseSaga)];
