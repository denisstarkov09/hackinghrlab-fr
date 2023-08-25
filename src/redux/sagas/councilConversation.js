import { put, fork, takeLatest, call } from "redux-saga/effects";
import { notification } from "antd";

import {
  constants as councilConversationConstants,
  actions as councilConversationActions,
} from "../actions/councilConversation-actions";

import { actions as homeActions } from "../actions/home-actions";

import {
  upsertCouncilConversation,
  getCouncilConversations,
  getCouncilConversation,
  deleteCouncilConversation,
} from "api";

export function* upsertCouncilConversationSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(
      upsertCouncilConversation,
      payload.councilConversation
    );

    if (response.status === 200) {
      yield put(
        councilConversationActions.setUpsertedCouncilConversation(
          response.data.councilConversation
        )
      );

      notification.success({
        message: "Success",
      });
    }
  } catch (err) {
    console.log(err);
    notification.error({
      message: "Something went wrong.",
    });
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* getCouncilConversationsSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getCouncilConversations, { ...payload });

    if (response.status === 200) {
      yield put(
        councilConversationActions.setCouncilConversations(
          response.data.councilConversations
        )
      );

      yield put(
        councilConversationActions.setCouncilConversation(
          response.data.councilConversation
        )
      );
    }
  } catch (err) {
    console.log(err);
    notification.error({
      message: "Something went wrong.",
    });
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* getCouncilConversationSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getCouncilConversation, { ...payload });

    if (response.status === 200) {
      yield put(
        councilConversationActions.setCouncilConversation(
          response.data.councilConversation
        )
      );
    }
  } catch (err) {
    console.log(err);
    notification.error({
      message: "Something went wrong.",
    });
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* destroyCouncilConversationSaga({ payload }) {
  yield put(homeActions.setLoading(true));
  try {
    const response = yield call(deleteCouncilConversation, { ...payload });

    if (response.status === 200) {
      yield put(
        councilConversationActions.setDeletedCouncilConversation(
          payload.CouncilConversationId
        )
      );

      yield put(
        councilConversationActions.setCouncilConversation(
          response.data.councilConversation
        )
      );

      notification.success({
        message: "Success",
      });
    }
  } catch (err) {
    console.log(err);
    notification.error({
      message: "Something went wrong.",
    });
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

function* watchCouncilConversation() {
  yield takeLatest(
    councilConversationConstants.UPSERT_COUNCIL_CONVERSATION,
    upsertCouncilConversationSaga
  );
  yield takeLatest(
    councilConversationConstants.GET_COUNCIL_CONVERSATIONS,
    getCouncilConversationsSaga
  );
  yield takeLatest(
    councilConversationConstants.GET_COUNCIL_CONVERSATION,
    getCouncilConversationSaga
  );
  yield takeLatest(
    councilConversationConstants.DESTROY_COUNCIL_CONVERSATION,
    destroyCouncilConversationSaga
  );
}

export const councilConversationSaga = [fork(watchCouncilConversation)];
