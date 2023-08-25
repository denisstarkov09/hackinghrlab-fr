import { handleActions } from "redux-actions";
import { Map } from "immutable";

// Action Type Imports
import { constants as conversationConstants } from "../actions/conversation-actions";

// Session's Reducer
export const reducers = {
  [conversationConstants.SET_CONVERSATIONS]: (state, { payload }) => {
    return state.merge({
      conversations: payload.conversations,
    });
  },
  [conversationConstants.SET_CONVERSATION]: (state, { payload }) => {
    return state.merge({
      conversation: payload.conversation,
    });
  },
  [conversationConstants.SET_CURRENT_CONVERSATIONS]: (state, { payload }) => {
    return state.merge({
      currentConversations: payload.currentConversations,
    });
  },
  [conversationConstants.UPDATE_CONVERSATION]: (state, { payload }) => {
    const allConversations = state.get("conversations");

    const allCurrentConversations = state.get("currentConversations");

    const conversationsUpdate = allConversations.map((conversation) =>
      conversation.id === payload.conversation.id
        ? {
            ...payload.conversation,
          }
        : conversation
    );

    const currentConversationsUpdate = allCurrentConversations.map(
      (currentConversation) =>
        currentConversation.id === payload.conversation.id
          ? {
              ...payload.conversation,
            }
          : currentConversation
    );
    return state.merge({
      conversations: conversationsUpdate,
      currentConversations: currentConversationsUpdate,
    });
  },
  [conversationConstants.SET_MESSAGE]: (state, { payload }) => {
    const allConversations = state.get("conversations");

    const allCurrentConversations = state.get("currentConversations");

    return state.merge({
      conversations: allConversations.map((conversation) =>
        conversation.id === payload.message.ConversationId
          ? {
              ...conversation,
              messages: [...conversation.messages, payload.message],
            }
          : conversation
      ),
      currentConversations: allCurrentConversations.map((currentConversation) =>
        currentConversation.id === payload.message.ConversationId
          ? {
              ...currentConversation,
              messages: [...currentConversation.messages, payload.message],
            }
          : currentConversation
      ),
    });
  },
};

export const initialState = () =>
  Map({
    conversations: [],
    conversation: {},
    currentConversations: [],
  });

export default handleActions(reducers, initialState());
