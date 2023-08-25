import { createAction } from "redux-actions";

const UPSERT_COUNCIL_EVENT = "UPSERT_COUNCIL_EVENT";
const SET_COUNCIL_EVENT = "SET_COUNCIL_EVENT";
const GET_COUNCIL_EVENTS = "GET_COUNCIL_EVENTS";
const SET_COUNCIL_EVENTS = "SET_COUNCIL_EVENTS";
const DELETE_COUNCIL_EVENT = "DELETE_COUNCIL_EVENT";
const JOIN_COUNCIL_EVENT = "JOIN_COUNCIL_EVENT";
const SET_JOIN_COUNCIL_EVENT = "SET_JOIN_COUNCIL_EVENT";
const REMOVE_COUNCIL_EVENT_PANELIST = "REMOVE_COUNCIL_EVENT_PANELIST";
const COUNCIL_EVENT_SEARCH_USER = "COUNCIL_EVENT_SEARCH_USER";
const SET_SEARCHED_USERS_FOR_COUNCIL_EVENT =
  "SET_SEARCHED_USERS_FOR_COUNCIL_EVENT";
const COUNCIL_EVENT_PANEL_COMMENT = "COUNCIL_EVENT_PANEL_COMMENT";
const SET_COUNCIL_EVENT_COMMENT = "SET_COUNCIL_EVENT_COMMENT";
const JOIN_COUNCIL_EVENT_WAIT = "JOIN_COUNCIL_EVENT_WAIT";
const DOWNLOAD_EVENTS_WITH_PARTICIPANTS = "DOWNLOAD_EVENTS_WITH_PARTICIPANTS";
const SEND_EMAIL_ATTEND_EVENT_ADMIN = "SEND_EMAIL_ATTEND_EVENT_ADMIN";
const ADD_EMAIL_DRAFT_EVENT = "ADD_EMAIL_DRAFT_EVENT";
const DELETE_EMAIL_DRAFT_EVENT = "DELETE_EMAIL_DRAFT_EVENT";
const GET_ALL_EMAIL_DRAFT_EVENT = "GET_ALL_EMAIL_DRAFT_EVENT";
const GET_ALL_EMAIL_SEND_EVENT = "GET_ALL_EMAIL_SEND_EVENT";
const UPDATE_ALL_EMAIL_DRAFTS = "UPDATE_ALL_EMAIL_DRAFTS";
const UPDATE_ALL_EMAIL_SEND = "UPDATE_ALL_EMAIL_SEND";

export const constants = {
  UPSERT_COUNCIL_EVENT,
  SET_COUNCIL_EVENT,
  GET_COUNCIL_EVENTS,
  SET_COUNCIL_EVENTS,
  DELETE_COUNCIL_EVENT,
  JOIN_COUNCIL_EVENT,
  SET_JOIN_COUNCIL_EVENT,
  REMOVE_COUNCIL_EVENT_PANELIST,
  COUNCIL_EVENT_SEARCH_USER,
  SET_SEARCHED_USERS_FOR_COUNCIL_EVENT,
  COUNCIL_EVENT_PANEL_COMMENT,
  SET_COUNCIL_EVENT_COMMENT,
  JOIN_COUNCIL_EVENT_WAIT,
  DOWNLOAD_EVENTS_WITH_PARTICIPANTS,
  SEND_EMAIL_ATTEND_EVENT_ADMIN,
  ADD_EMAIL_DRAFT_EVENT,
  DELETE_EMAIL_DRAFT_EVENT,
  GET_ALL_EMAIL_DRAFT_EVENT,
  GET_ALL_EMAIL_SEND_EVENT,
  UPDATE_ALL_EMAIL_SEND,
  UPDATE_ALL_EMAIL_DRAFTS
};

export const upsertCouncilEvent = createAction(
  UPSERT_COUNCIL_EVENT,
  (councilEvent, callback) => ({ councilEvent, callback })
);
export const setUpsertCouncilEvent = createAction(
  SET_COUNCIL_EVENT,
  (councilEvent, isEdit) => ({ councilEvent, isEdit })
);
export const getCouncilEvents = createAction(GET_COUNCIL_EVENTS, (callback) => ({ callback }));
export const setCouncilEvents = createAction(
  SET_COUNCIL_EVENTS,
  (councilEvents) => ({
    councilEvents,
  })
);
export const deleteCouncilEvent = createAction(
  DELETE_COUNCIL_EVENT,
  (councilEventId) => ({ councilEventId })
);
export const joinCouncilEvent = createAction(
  JOIN_COUNCIL_EVENT,
  (
    councilEventPanelId,
    UserId,
    status,
    isAddedByAdmin = false,
    isModerator = false,
    councilEventId,
    callback
  ) => ({
    councilEventPanelId,
    UserId,
    status,
    isAddedByAdmin,
    isModerator,
    councilEventId,
    callback
  })
);
export const setJoinCouncilEvent = createAction(
  SET_JOIN_COUNCIL_EVENT,
  (councilEventPanelist) => ({ councilEventPanelist })
);
export const removeCouncilEventPanelist = createAction(
  REMOVE_COUNCIL_EVENT_PANELIST,
  (CouncilEventPanelId, CouncilEventPanelistId) => ({
    CouncilEventPanelId,
    CouncilEventPanelistId,
  })
);
export const searchUserForCouncilEventPanelist = createAction(
  COUNCIL_EVENT_SEARCH_USER,
  (keyword) => ({ keyword })
);
export const setSearchedUserForCouncilEventPanelist = createAction(
  SET_SEARCHED_USERS_FOR_COUNCIL_EVENT,
  (users) => ({ users })
);
export const upsertCommentCouncilEventPanel = createAction(
  COUNCIL_EVENT_PANEL_COMMENT,
  (councilEventPanelComment) => ({ councilEventPanelComment })
);
export const setCouncilEventPanelComment = createAction(
  SET_COUNCIL_EVENT_COMMENT,
  (councilEventPanelComment) => ({ councilEventPanelComment })
);

export const joinCouncilEventWait = createAction(
  JOIN_COUNCIL_EVENT_WAIT,
  (
    councilEventPanelId,
    UserId,
    status,
    isAddedByAdmin = false,
    isModerator = false,
    councilEventId,
    callback
  ) => ({
    councilEventPanelId,
    UserId,
    status,
    isAddedByAdmin,
    isModerator,
    councilEventId,
    callback
  })
);

export const exportCouncilEvents = createAction(
  DOWNLOAD_EVENTS_WITH_PARTICIPANTS,
  (idEvent, callback) => ({ idEvent, callback })
)

export const sendEmailAttendeeEventAdmin = createAction(
  SEND_EMAIL_ATTEND_EVENT_ADMIN,
  (data, callback) => ({ data, callback })
)

export const addEmailDraftEvent = createAction(
  ADD_EMAIL_DRAFT_EVENT,
  (draftEmail, callback) => ({ draftEmail, callback })
)

export const deleteEmailDraftEvent = createAction(
  DELETE_EMAIL_DRAFT_EVENT,
  (draftEmailId, callback) => ({ draftEmailId, callback })
)

export const getAllEmailDraftEvent = createAction(
  GET_ALL_EMAIL_DRAFT_EVENT,
  (id, callback) => ({ id, callback })
)

export const getAllEmailSendEvent = createAction(
  GET_ALL_EMAIL_SEND_EVENT,
  (callback) => ({ callback })
)

export const updateAllEmailEvent = createAction(
  UPDATE_ALL_EMAIL_DRAFTS,
  (draftEmailResponse) => ({ draftEmailResponse })
)

export const updateAllEmailEventSend = createAction(
  UPDATE_ALL_EMAIL_SEND,
  (sendEmailResponse) => ({ sendEmailResponse })
)

export const actions = {
  upsertCouncilEvent,
  setUpsertCouncilEvent,
  getCouncilEvents,
  setCouncilEvents,
  deleteCouncilEvent,
  joinCouncilEvent,
  setJoinCouncilEvent,
  removeCouncilEventPanelist,
  searchUserForCouncilEventPanelist,
  setSearchedUserForCouncilEventPanelist,
  upsertCommentCouncilEventPanel,
  setCouncilEventPanelComment,
  joinCouncilEventWait,
  exportCouncilEvents,
  sendEmailAttendeeEventAdmin,
  addEmailDraftEvent,
  deleteEmailDraftEvent,
  getAllEmailDraftEvent,
  getAllEmailSendEvent,
  updateAllEmailEvent,
  updateAllEmailEventSend,
};
