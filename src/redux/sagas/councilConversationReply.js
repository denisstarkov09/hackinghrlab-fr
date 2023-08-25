import { put, fork, takeLatest, call } from "redux-saga/effects";
import { notification } from "antd";

import {
  upsertCouncilConversationReply,
  deleteCouncilConversationReply,
} from "api";

import { constants as councilConversationReplyConstants } from "../actions/council-conversation-reply-actions";
import { actions as councilConversationActions } from "../actions/councilConversation-actions";
import { actions as homeActions } from "../actions/home-actions";

function* upsertCouncilConversationReplySaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(
      upsertCouncilConversationReply,
      payload.councilConversationReply
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

function* deleteCouncilConversationReplySaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(deleteCouncilConversationReply, { ...payload });

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

function* watchCouncilConversationReply() {
  yield takeLatest(
    councilConversationReplyConstants.UPSERT_COUNCIL_CONVERSATION_REPLY,
    upsertCouncilConversationReplySaga
  );
  yield takeLatest(
    councilConversationReplyConstants.DELETE_COUNCIL_CONVERSATION_REPLY,
    deleteCouncilConversationReplySaga
  );
}

export const councilConversationReplySaga = [
  fork(watchCouncilConversationReply),
];
