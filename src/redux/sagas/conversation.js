import { put, fork, takeLatest, call, select } from "redux-saga/effects";
import groupBy from "lodash/groupBy";
import omit from "lodash/omit";
import {
  constants as conversationConstants,
  actions as conversationActions,
} from "../actions/conversation-actions";
import { logout } from "../actions/auth-actions";
import {
  createConversation,
  getConversations,
  readMessages,
  getMoreMessages,
  getConversation,
  hideConversation,
} from "../../api";

export function* createConversationSaga({ payload }) {
  try {
    yield call(createConversation, { ...payload });
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  }
}

export function* getConversationsSaga({ payload }) {
  try {
    const response = yield call(getConversations, { ...payload });

    if (response.status === 200) {
      const conversationSort = response.data.conversations.sort((a, b) => {
        if (a?.messages[0]?.messageDate > b?.messages[0]?.messageDate) {
          return 1;
        } else if (b?.messages[0]?.messagedate > a?.messages[0]?.messagedate) {
          return -1;
        }
        return 0;
      });
      const conversationsData = Object.values(
        groupBy(conversationSort || [], "id")
      ).map((conversation) => {
        const newConversation = conversation.reduce(
          (res, item) => ({
            ...res,
            ...omit(item, [
              "userid",
              "abbrName",
              "email",
              "firstName",
              "lastname",
              "img",
              "timezone",
              "isOnline",
            ]),
            members: [
              ...(res.members || []),
              {
                id: item.userid,
                abbrName: item.abbrName,
                email: item.email,
                firstName: item.firstName,
                lastName: item.lastName,
                img: item.img,
                timezone: item.timezone,
                isOnline: item.isOnline,
              },
            ],
          }),
          {}
        );

        const membersReduce = (newConversation.members || []).filter(
          (member, index, self) =>
            index === self.findIndex((m) => m.id === member.id)
        );

        return {
          ...newConversation,
          members: membersReduce,
        };
      });

      yield put(conversationActions.setConversations(conversationsData));
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  }
}

export function* getConversationSaga({ payload }) {
  try {
    const response = yield call(getConversation, { ...payload });

    const selectAllState = (state) => state;

    const allState = yield select(selectAllState);

    const conversations = allState.conversation.get("conversations");

    const currentConversation = conversations.find(
      (conversation) => conversation.id === payload.conversationId
    );

    if (response.status === 200) {
      const [conversationData] = Object.values(
        groupBy(response.data.conversation || [], "id")
      ).map((conversation) => {
        const newConversation = conversation.reduce(
          (res, item) => ({
            ...res,
            ...omit(item, [
              "userid",
              "abbrName",
              "email",
              "firstName",
              "lastname",
              "img",
              "timezone",
              "messageid",
              "ConversationId",
              "sender",
              "text",
              "messagedate",
              "viewedUser",
              "isOnline",
            ]),
            members: [
              ...(res.members || []),
              {
                id: item.userid,
                abbrName: item.abbrName,
                email: item.email,
                firstName: item.firstName,
                lastName: item.lastName,
                img: item.img,
                timezone: item.timezone,
                isOnline: item.isOnline,
              },
            ],
            messages: [
              ...(res.messages || []),
              item.messageid && {
                id: item.messageid,
                ConversationId: item.ConversationId,
                sender: item.sender,
                text: item.text,
                messageDate: item.messagedate,
                viewedUser: item.viewedUser,
              },
            ],
          }),
          {}
        );

        const membersReduce = (newConversation.members || []).filter(
          (member, index, self) =>
            index === self.findIndex((m) => m.id === member.id)
        );

        return {
          ...newConversation,
          messages: payload.message
            ? [...currentConversation.messages, payload.message]
            : [...currentConversation.messages],
          members: membersReduce,
        };
      });

      yield put(conversationActions.updateConversation(conversationData));
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  }
}

export function* readMessagesSaga({ payload }) {
  try {
    const response = yield call(readMessages, { ...payload });

    if (response.status === 200) {
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  }
}

export function* getMoreMessagesSaga({ payload }) {
  try {
    const response = yield call(getMoreMessages, { ...payload });

    if (response.status === 200) {
      const selectAllState = (state) => state;

      const allState = yield select(selectAllState);

      const conversations = allState.conversation.get("conversations");

      const conversationsData = conversations.map((conversation) => {
        if (conversation.id === response.data.messages[0].ConversationId) {
          const newConversationMessages = [
            ...response.data.messages,
            ...conversation.messages,
          ];
          return {
            ...conversation,
            messages: newConversationMessages,
          };
        }
        return {
          ...conversation,
        };
      });

      yield put(conversationActions.setConversations(conversationsData));
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  }
}

export function* hideConversationSaga({ payload }) {
  try {
    const response = yield call(hideConversation, { ...payload });
    if (response.status === 200) {
      const selectAllState = (state) => state;
      const allState = yield select(selectAllState);
      const conversations = allState.conversation.get("conversations");
      const conversationsData = conversations.map((conversation) => {
        if (conversation.id === response.data.conversation.id) {
          return {
            ...response.data.conversation,
            messages: [...conversation.messages],
            members: [...conversation.members],
          };
        }
        return {
          ...conversation,
        };
      });

      yield put(conversationActions.setConversations(conversationsData));
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  }
}

function* watchSession() {
  yield takeLatest(
    conversationConstants.CREATE_CONVERSATION,
    createConversationSaga
  );
  yield takeLatest(
    conversationConstants.GET_CONVERSATIONS,
    getConversationsSaga
  );
  yield takeLatest(conversationConstants.GET_CONVERSATION, getConversationSaga);
  yield takeLatest(conversationConstants.READ_MESSAGES, readMessagesSaga);
  yield takeLatest(
    conversationConstants.GET_MORE_MESSAGES,
    getMoreMessagesSaga
  );
  yield takeLatest(
    conversationConstants.HIDE_CONVERSATION,
    hideConversationSaga
  );
}

export const conversationSaga = [fork(watchSession)];
