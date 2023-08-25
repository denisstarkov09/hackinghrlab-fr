import { handleActions } from "redux-actions";
import { Map } from "immutable";

// Action Type Imports
import { constants as sessionConstants } from "../actions/session-actions";
import { cloneDeep } from "lodash";

// Session's Reducer
export const reducers = {
  [sessionConstants.SET_ALL_SESSIONS]: (state, { payload }) => {
    return state.merge({
      allSessions: payload.allSessions,
    });
  },
  [sessionConstants.SET_SESSION]: (state, { payload }) => {
    return state.merge({
      session: payload.session,
    });
  },
  [sessionConstants.SET_SESSION_CLASSES]: (state, { payload }) => {
    return state.merge({ classes: cloneDeep(payload.classes) });
  },
  [sessionConstants.SET_SESSIONS_ADDED_BY_USER]: (state, { payload }) => {
    return state.merge({
      sessionsUser: payload.sessionsUser,
    });
  },
  [sessionConstants.SET_SESSIONS_USER_JOINED]: (state, { payload }) => {
    return state.merge({
      sessionsUserJoined: payload.sessionsUserJoined,
    });
  },
  [sessionConstants.SET_PARTICIPANTS]: (state, { payload }) => {
    return state.merge({
      participants: cloneDeep(payload.participants),
    });
  },
  [sessionConstants.SET_RECOMMENDED_AGENDA]: (state, { payload }) => {
    return state.merge({
      recommendedAgendaSessions: cloneDeep(payload.recommendedAgendaSessions),
    });
  },
  [sessionConstants.UPDATE_SESSION_VIEWED]: (state, { payload }) => {
    const allSessions = state.get("allSessions");
    return state.merge({
      allSessions: cloneDeep(
        allSessions.map((session) =>
          session.id === payload.session.id
            ? {
                ...payload.session,
                speakers: [...session.speakers],
              }
            : session
        )
      ),
    });
  },
  [sessionConstants.UPDATE_SAVE_FOR_LATER_SESSION]: (state, { payload }) => {
    const allSessions = state.get("allSessions");
    return state.merge({
      allSessions: cloneDeep(
        allSessions.map((session) =>
          session.id === payload.session.id
            ? {
                ...payload.session,
                speakers: [...session.speakers],
              }
            : session
        )
      ),
    });
  },
  [sessionConstants.SET_SESSION_LOADING]: (state, { payload }) => {
    return state.merge({
      sessionLoading: payload.loading,
    });
  },
  [sessionConstants.SET_MESSAGE_ERROR]: (state, { payload }) => {
    return state.merge({
      messageError: payload.message,
    });
  },
};

export const initialState = () =>
  Map({
    sessionLoading: false,
    allSessions: [],
    session: {},
    classes: [],
    sessionsUser: [],
    sessionsUserJoined: [],
    participants: [],
    recommendedAgendaSessions: [],
    messageError: "",
  });

export default handleActions(reducers, initialState());
