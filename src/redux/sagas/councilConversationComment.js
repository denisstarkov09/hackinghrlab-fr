import { put, fork, takeLatest, call } from "redux-saga/effects";
import { notification } from "antd";

import {
  upsertCouncilConversationComment,
  deleteCouncilConversationComment,
} from "api";

import { constants as councilConversationCommentConstants } from "../actions/council-conversation-comment-actions";
import { actions as councilConversationActions } from "../actions/councilConversation-actions";
import { actions as homeActions } from "../actions/home-actions";

export function* upsertCouncilConversationCommentSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(
      upsertCouncilConversationComment,
      payload.councilConversationComment
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

export function* deleteCouncilConversationCommentSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(deleteCouncilConversationComment, {
      ...payload,
    });

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

function* watchCouncilConversationComment() {
  yield takeLatest(
    councilConversationCommentConstants.UPSERT_COUNCIL_CONVERSATION_COMMENT,
    upsertCouncilConversationCommentSaga
  );
  yield takeLatest(
    councilConversationCommentConstants.DELETE_COUNCIL_CONVERSATION_COMMENT,
    deleteCouncilConversationCommentSaga
  );
}

export const councilConversationCommentSaga = [
  fork(watchCouncilConversationComment),
];
