import { createSelector } from "reselect";

const councilConversationDataSelector = (state) => state.councilConversation;

const resultSelector = createSelector(
  councilConversationDataSelector,
  (payload) => {
    return {
      councilConversations: payload.get("councilConversations"),
      councilConversation: payload.get("councilConversation"),
    };
  }
);

export const councilConversationSelector = (state) => ({
  ...resultSelector(state),
});
