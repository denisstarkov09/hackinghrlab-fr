import { handleActions } from "redux-actions";

import { constants as councilConversationConstants } from "../actions/councilConversation-actions";
import { Map } from "immutable";

export const reducers = {
  [councilConversationConstants.SET_COUNCIL_CONVERSATIONS]: (
    state,
    { payload }
  ) => {
    return state.merge({
      councilConversations: payload.councilConversations,
    });
  },
  [councilConversationConstants.SET_COUNCIL_CONVERSATION]: (
    state,
    { payload }
  ) => {
    return state.merge({
      councilConversation: payload.councilConversation,
    });
  },
  [councilConversationConstants.SET_UPSERTED_COUNCIL_CONVERSATION]: (
    state,
    { payload }
  ) => {
    const councilConversations = state.get("councilConversations");
    let transformedCouncilConversation = [...councilConversations];

    const index = transformedCouncilConversation.findIndex(
      (convo) => convo.id === payload.councilConversation.id
    );

    const isFound = index >= 0;

    if (isFound) {
      transformedCouncilConversation[index] = payload.councilConversation;
    } else {
      transformedCouncilConversation = [
        payload.councilConversation,
        ...transformedCouncilConversation,
      ];
    }

    return state.merge({
      councilConversations: transformedCouncilConversation,
      councilConversation: payload.councilConversation,
    });
  },
  [councilConversationConstants.SET_DELETED_COUNCIL_CONVERSATION]: (
    state,
    { payload }
  ) => {
    const councilConversations = state.get("councilConversations");

    const transformedCouncilConversations = councilConversations.filter(
      (convo) => convo.id !== payload.CouncilConversationId
    );

    return state.merge({
      councilConversations: transformedCouncilConversations,
    });
  },
};

export const initialState = () => {
  return Map({
    councilConversations: [],
    councilConversation: {},
  });
};

export default handleActions(reducers, initialState());
