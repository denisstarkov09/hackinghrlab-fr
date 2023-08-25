import { createAction } from "redux-actions";

const CREATE_CONVERSATION = "CREATE_CONVERSATION";
const GET_CONVERSATIONS = "GET_CONVERSATIONS";
const SET_CONVERSATIONS = "SET_CONVERSATIONS";
const GET_CONVERSATION = "GET_CONVERSATION";
const SET_CONVERSATION = "SET_CONVERSATION";
const SET_CURRENT_CONVERSATIONS = "SET_CURRENT_CONVERSATIONS";
const UPDATE_CONVERSATION = "UPDATE_CONVERSATION";
const SET_MESSAGE = "SET_MESSAGE";
const READ_MESSAGES = "READ_MESSAGES";
const GET_MORE_MESSAGES = "GET_MORE_MESSAGES";
const HIDE_CONVERSATION = "HIDE_CONVERSATION";

export const constants = {
  CREATE_CONVERSATION,
  GET_CONVERSATIONS,
  SET_CONVERSATIONS,
  GET_CONVERSATION,
  SET_CONVERSATION,
  SET_CURRENT_CONVERSATIONS,
  SET_MESSAGE,
  READ_MESSAGES,
  GET_MORE_MESSAGES,
  UPDATE_CONVERSATION,
  HIDE_CONVERSATION,
};

// ------------------------------------
// Actions
// ------------------------------------
export const createConversartion = createAction(
  CREATE_CONVERSATION,
  (members) => ({
    members,
  })
);

export const getConversations = createAction(GET_CONVERSATIONS, (id) => ({
  id,
}));

export const setConversations = createAction(
  SET_CONVERSATIONS,
  (conversations) => ({
    conversations,
  })
);

export const getConversation = createAction(
  GET_CONVERSATION,
  (conversationId, message) => ({
    conversationId,
    message,
  })
);

export const setConversation = createAction(
  SET_CONVERSATION,
  (conversation) => ({
    conversation,
  })
);

export const setCurrentConversations = createAction(
  SET_CURRENT_CONVERSATIONS,
  (currentConversations) => ({
    currentConversations,
  })
);

export const setMessage = createAction(SET_MESSAGE, (message) => ({
  message,
}));
export const readMessages = createAction(
  READ_MESSAGES,
  (id, ConversationId) => ({
    id,
    ConversationId,
  })
);

export const getMoreMessages = createAction(
  GET_MORE_MESSAGES,
  (offset, ConversationId) => ({
    offset,
    ConversationId,
  })
);

export const updateConversation = createAction(
  UPDATE_CONVERSATION,
  (conversation) => ({ conversation })
);

export const hideConversation = createAction(
  HIDE_CONVERSATION,
  (conversationId) => ({ conversationId })
);

export const actions = {
  createConversartion,
  getConversations,
  setConversations,
  getConversation,
  setConversation,
  setCurrentConversations,
  setMessage,
  readMessages,
  getMoreMessages,
  updateConversation,
  hideConversation,
};
