import { createSelector } from "reselect";

const sessionDataSelector = (state) => state.session;

const resultSelector = createSelector(sessionDataSelector, (payload) => {
  return {
    sessionLoading: payload.get("sessionLoading"),
    allSessions: payload.get("allSessions"),
    session: payload.get("session"),
    classes: payload.get("classes"),
    sessionsUser: payload.get("sessionsUser"),
    sessionsUserJoined: payload.get("sessionsUserJoined"),
    participants: payload.get("participants"),
    partners: payload.get("partners"),
    recommendedAgendaSessions: payload.get("recommendedAgendaSessions"),
    messageError: payload.get("messageError"),
  };
});

export const sessionSelector = (state) => ({
  ...resultSelector(state),
});
