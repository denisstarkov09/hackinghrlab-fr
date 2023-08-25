import { createAction } from "redux-actions";

const UPSERT_COUNCIL_CONVERSATION_COMMENT =
  "UPSERT_COUNCIL_CONVERSATION_COMMENT";

const DELETE_COUNCIL_CONVERSATION_COMMENT =
  "DELETE_COUNCIL_CONVERSATION_COMMENT";

export const constants = {
  UPSERT_COUNCIL_CONVERSATION_COMMENT,
  DELETE_COUNCIL_CONVERSATION_COMMENT,
};

const upsertCouncilConversationComment = createAction(
  UPSERT_COUNCIL_CONVERSATION_COMMENT,
  (councilConversationComment) => ({ councilConversationComment })
);

const deleteCouncilConversationComment = createAction(
  DELETE_COUNCIL_CONVERSATION_COMMENT,
  (CouncilConversationCommentId, CouncilConversationId) => ({
    CouncilConversationCommentId,
    CouncilConversationId,
  })
);

export const actions = {
  upsertCouncilConversationComment,
  deleteCouncilConversationComment
};
