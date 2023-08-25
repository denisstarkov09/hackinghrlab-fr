import { handleActions } from "redux-actions";
import { Map } from "immutable";
import { cloneDeep } from "lodash";

import { constants as councilEventConstants } from "../actions/council-events-actions";

export const reducers = {
  [councilEventConstants.SET_COUNCIL_EVENTS]: (state, { payload }) => {
    return state.merge({
      allCouncilEvents: payload.councilEvents,
    });
  },
  [councilEventConstants.SET_COUNCIL_EVENT]: (state, { payload }) => {
    const allCouncilEvents = state.get("allCouncilEvents");
    let transformedCouncilEvents = [...allCouncilEvents];

    if (payload.isEdit) {
      const index = allCouncilEvents.findIndex(
        (event) => event.id === payload.councilEvent.id
      );

      if (index >= 0) {
        transformedCouncilEvents[index] = payload.councilEvent;
      }
    } else {
      transformedCouncilEvents = [
        ...transformedCouncilEvents,
        payload.councilEvent,
      ];
    }

    return state.merge({
      allCouncilEvents: transformedCouncilEvents,
    });
  },
  [councilEventConstants.SET_JOIN_COUNCIL_EVENT]: (state, { payload }) => {
    const allCouncilEvents = state.get("allCouncilEvents");
    let newAllCouncilEvents = [...allCouncilEvents];

    const eventIndex = allCouncilEvents.findIndex(
      (event) => event.id === payload.councilEventPanelist.CouncilEventId
    );

    if (eventIndex >= 0) {
      const panelIndex = allCouncilEvents[
        eventIndex
      ].CouncilEventPanels.findIndex(
        (panel) => panel.id === payload.councilEventPanelist.CouncilEventPanelId
      );

      if (panelIndex >= 0) {
        if (payload.councilEventPanelist.isJoining) {
          newAllCouncilEvents[eventIndex].CouncilEventPanels[
            panelIndex
          ].CouncilEventPanelists = [
              ...newAllCouncilEvents[eventIndex].CouncilEventPanels[panelIndex]
                .CouncilEventPanelists,
              payload.councilEventPanelist,
            ];
        } else {
          newAllCouncilEvents[eventIndex].CouncilEventPanels[
            panelIndex
          ].CouncilEventPanelists = newAllCouncilEvents[
            eventIndex
          ].CouncilEventPanels[panelIndex].CouncilEventPanelists.filter(
            (panelist) =>
              panelist.UserId !== payload.councilEventPanelist.UserId
          );
        }
      }
    }

    return state.merge({
      allCouncilEvents: cloneDeep([...newAllCouncilEvents]),
    });
  },
  [councilEventConstants.SET_COUNCIL_EVENT_COMMENT]: (state, { payload }) => {
    const allCouncilEvents = state.get("allCouncilEvents");
    let newAllCouncilEvents = [...allCouncilEvents];

    const eventIndex = allCouncilEvents.findIndex(
      (event) => event.id === payload.councilEventPanelComment.CouncilEventId
    );

    if (eventIndex >= 0) {
      const panelIndex = allCouncilEvents[
        eventIndex
      ].CouncilEventPanels.findIndex(
        (panel) =>
          panel.id === payload.councilEventPanelComment.CouncilEventPanelId
      );
      if (panelIndex >= 0) {
        if (newAllCouncilEvents[eventIndex].CouncilEventPanels[panelIndex].CouncilEventPanelComments !== undefined) {
          newAllCouncilEvents[eventIndex].CouncilEventPanels[
            panelIndex
          ].CouncilEventPanelComments = [
              ...newAllCouncilEvents[eventIndex].CouncilEventPanels[panelIndex].CouncilEventPanelComments,
              payload.councilEventPanelComment,
            ];
        } else {
          newAllCouncilEvents[eventIndex].CouncilEventPanels[
            panelIndex
          ].CouncilEventPanelComments = [
              payload.councilEventPanelComment,
            ];
        }
      }
    }

    return state.merge({
      allCouncilEvents: cloneDeep([...newAllCouncilEvents]),
    });
  },
  [councilEventConstants.SET_SEARCHED_USERS_FOR_COUNCIL_EVENT]: (
    state,
    { payload }
  ) => {
    const options = payload.users.map((user) => {
      return {
        label: `${user.firstName} ${user.lastName} / ${user.email}`,
        value: `${user.firstName} ${user.lastName} / ${user.email}`,
        id: user.id,
      };
    });

    return state.merge({
      searchedUsersForCouncilEvent: options,
    });
  },
  [councilEventConstants.UPDATE_ALL_EMAIL_DRAFTS]: (state, { payload }) => {
    const { draftEmailResponse, bul } = payload.draftEmailResponse
    const emailDraft = state.get("emailDraftChannel");

    if (bul === true) {
      return state.merge({
        emailDraftChannel: [draftEmailResponse, ...emailDraft],
      })
    } else {
      return state.merge({
        emailDraftChannel: draftEmailResponse,
      })
    }
  },
  [councilEventConstants.UPDATE_ALL_EMAIL_SEND]: (state, { payload }) => {
    const { sendEmailResponse } = payload.sendEmailResponse
    // const emailDraft = state.get("emailDraftChannel");

    return state.merge({
      allEmailSendEvent: sendEmailResponse,
    })
  },
};

export const initialState = () =>
  Map({
    allCouncilEvents: [],
    councilEvent: {},
    searchedUsersForCouncilEvent: [],
    emailDraftChannel: [],
    allEmailSendEvent: [],
  });

export default handleActions(reducers, initialState());
