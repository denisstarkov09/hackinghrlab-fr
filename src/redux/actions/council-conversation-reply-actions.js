import { createAction } from "redux-actions";

const UPSERT_COUNCIL_CONVERSATION_REPLY = "UPSERT_COUNCIL_CONVERSATION_REPLY";
const DELETE_COUNCIL_CONVERSATION_REPLY = "DELETE_COUNCIL_CONVERSATION_REPLY";

export const constants = {
  UPSERT_COUNCIL_CONVERSATION_REPLY,
  DELETE_COUNCIL_CONVERSATION_REPLY,
};

const upsertCouncilConversationReply = createAction(
  UPSERT_COUNCIL_CONVERSATION_REPLY,
  (councilConversationReply) => ({ councilConversationReply })
);
const deleteCouncilConversationReply = createAction(
  DELETE_COUNCIL_CONVERSATION_REPLY,
  (CouncilConversationReplyId, CouncilConversationId) => ({
    CouncilConversationReplyId,
    CouncilConversationId,
  })
);

export const actions = {
  upsertCouncilConversationReply,
  deleteCouncilConversationReply
};
