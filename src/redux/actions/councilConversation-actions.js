import { createAction } from "redux-actions";

const UPSERT_COUNCIL_CONVERSATION = "UPSERT_COUNCIL_CONVERSATION";
const SET_UPSERTED_COUNCIL_CONVERSATION = "SET_UPSERTED_COUNCIL_CONVERSATION";
const GET_COUNCIL_CONVERSATIONS = "GET_COUNCIL_CONVERSATIONS";
const SET_COUNCIL_CONVERSATIONS = "SET_COUNCIL_CONVERSATIONS";
const GET_COUNCIL_CONVERSATION = "GET_COUNCIL_CONVERSATION";
const SET_COUNCIL_CONVERSATION = "SET_COUNCIL_CONVERSATION";
const DESTROY_COUNCIL_CONVERSATION = "DESTROY_COUNCIL_CONVERSATION";
const SET_DELETED_COUNCIL_CONVERSATION = "SET_DELETED_COUNCIL_CONVERSATION";

export const constants = {
  UPSERT_COUNCIL_CONVERSATION,
  SET_UPSERTED_COUNCIL_CONVERSATION,
  GET_COUNCIL_CONVERSATIONS,
  SET_COUNCIL_CONVERSATIONS,
  GET_COUNCIL_CONVERSATION,
  SET_COUNCIL_CONVERSATION,
  DESTROY_COUNCIL_CONVERSATION,
  SET_DELETED_COUNCIL_CONVERSATION,
};

const upsertCouncilConversation = createAction(
  UPSERT_COUNCIL_CONVERSATION,
  (councilConversation) => ({ councilConversation })
);
const setUpsertedCouncilConversation = createAction(
  SET_UPSERTED_COUNCIL_CONVERSATION,
  (councilConversation) => ({ councilConversation })
);
const getCouncilConversations = createAction(
  GET_COUNCIL_CONVERSATIONS,
  (filters) => ({ filters })
);
const setCouncilConversations = createAction(
  SET_COUNCIL_CONVERSATIONS,
  (councilConversations) => ({ councilConversations })
);
const getCouncilConversation = createAction(
  GET_COUNCIL_CONVERSATION,
  (CouncilConversationId) => ({ CouncilConversationId })
);
const setCouncilConversation = createAction(
  SET_COUNCIL_CONVERSATION,
  (councilConversation) => ({ councilConversation })
);
const destroyCouncilConversation = createAction(
  DESTROY_COUNCIL_CONVERSATION,
  (CouncilConversationId) => ({ CouncilConversationId })
);
const setDeletedCouncilConversation = createAction(
  SET_DELETED_COUNCIL_CONVERSATION,
  (CouncilConversationId) => ({ CouncilConversationId })
);

export const actions = {
  upsertCouncilConversation,
  setUpsertedCouncilConversation,
  getCouncilConversations,
  setCouncilConversations,
  getCouncilConversation,
  setCouncilConversation,
  destroyCouncilConversation,
  setDeletedCouncilConversation,
};
