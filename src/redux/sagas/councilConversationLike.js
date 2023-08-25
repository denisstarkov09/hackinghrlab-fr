import { put, fork, takeLatest, call } from "redux-saga/effects";
import { notification } from "antd";

import {
  createCouncilConversationLike,
  deleteCouncilConversationLike,
} from "api";

import { constants as councilConversationLikeConstants } from "../actions/council-conversation-like-actions";
import { actions as councilConversationActions } from "../actions/councilConversation-actions";
import { actions as homeActions } from "../actions/home-actions";

export function* createCouncilConversationLikeSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(
      createCouncilConversationLike,
      payload.CouncilConversationId
    );

    if (response.status === 200) {
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

export function* deleteCouncilConversationLikeSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(
      deleteCouncilConversationLike,
      payload.CouncilConversationId
    );

    if (response.status === 200) {
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

function* watchCouncilConversationLike() {
  yield takeLatest(
    councilConversationLikeConstants.CREATE_COUNCIL_CONVERSATION_LIKE,
    createCouncilConversationLikeSaga
  );
  yield takeLatest(
    councilConversationLikeConstants.DELETE_COUNCIL_CONVERSATION_LIKE,
    deleteCouncilConversationLikeSaga
  );
}

export const councilConversationLikeSaga = [fork(watchCouncilConversationLike)];
