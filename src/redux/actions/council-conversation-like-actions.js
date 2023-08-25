import { createAction } from "redux-actions";

const CREATE_COUNCIL_CONVERSATION_LIKE = "CREATE_COUNCIL_CONVERSATION_LIKE";
const DELETE_COUNCIL_CONVERSATION_LIKE = "DELETE_COUNCIL_CONVERSATION_LIKE";

export const constants = {
  CREATE_COUNCIL_CONVERSATION_LIKE,
  DELETE_COUNCIL_CONVERSATION_LIKE,
};

const createCouncilConversationLike = createAction(
  CREATE_COUNCIL_CONVERSATION_LIKE,
  (CouncilConversationId) => ({ CouncilConversationId })
);
const deleteCouncilConversationLike = createAction(
  DELETE_COUNCIL_CONVERSATION_LIKE,
  (CouncilConversationId) => ({ CouncilConversationId })
);

export const actions = {
  createCouncilConversationLike,
  deleteCouncilConversationLike
}
