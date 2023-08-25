import { createAction } from "redux-actions";

const GET_ALL_EVENTS = "GET_ALL_EVENTS";
const GET_METADATA = "GET_METADATA";
const SET_METADATA = "SET_METADATA";
const GET_LIVE_EVENTS = "GET_LIVE_EVENTS";
const GET_EVENT = "GET_EVENT";
const SET_ALL_EVENTS = "SET_ALL_EVENTS";
const SET_EVENT = "SET_EVENT";
const SET_ERROR = "SET_ERROR";
const SET_LOADING = "SET_EVENT_LOADING";
const ADD_TO_MY_EVENT_LIST = "ADD_TO_MY_EVENT_LIST";
const REMOVE_FROM_MY_EVENT_LIST = "REMOVE_FROM_MY_EVENT_LIST";
const GET_MY_EVENTS = "GET_MY_EVENTS";
const SET_MY_EVENTS = "SET_MY_EVENTS";
const SET_MY_LIVE_EVENTS = "SET_MY_LIVE_EVENTS";
const SET_MY_LIVE_EVENT = "SET_MY_LIVE_EVENT";
const UPDATE_EVENT_STATUS = "UPDATE_EVENT_STATUS";
const CREATE_CHANNEL_EVENT = "CREATE_CHANNEL_EVENT";
const GET_CHANNEL_EVENTS = "GET_CHANNEL_EVENTS";
const SET_CHANNEL_EVENTS = "SET_CHANNEL_EVENTS";
const DELETE_EVENT = "DELETE_EVENT";
const UPDATE_EVENT = "UPDATE_EVENT";
const UPDATE_EVENT_USER_ASSISTENCE = "UPDATE_EVENT_USER_ASSISTENCE";
const UPDATE_CHANNEL_EVENT = "UPDATE_CHANNEL_EVENT";
const EVENT_CLAIM_CREDIT = "EVENT_CLAIM_CREDIT";
const EVENT_CLAIM_ATTENDANCE = "EVENT_CLAIM_ATTENDANCE";
const SET_ALL_EVENT_CHANNELS = "SET_ALL_EVENT_CHANNELS";
const GET_ALL_EVENTS_CHANNELS = "GET_ALL_EVENTS_CHANNELS";
const VERIFY_SUSCRIBED_USER = "VERIFY_SUSCRIBED_USER";
const SUSCRIBED_USER = "SUSCRIBED_USER";
const SET_ONLY_ONE_EVENT = "SET_ONLY_ONE_EVENT"

export const constants = {
  GET_ALL_EVENTS,
  GET_LIVE_EVENTS,
  GET_EVENT,
  SET_ALL_EVENTS,
  GET_METADATA,
  SET_METADATA,
  SET_EVENT,
  SET_ERROR,
  SET_MY_LIVE_EVENTS,
  SET_MY_LIVE_EVENT,
  SET_LOADING,
  ADD_TO_MY_EVENT_LIST,
  REMOVE_FROM_MY_EVENT_LIST,
  GET_MY_EVENTS,
  SET_MY_EVENTS,
  UPDATE_EVENT_STATUS,
  CREATE_CHANNEL_EVENT,
  GET_CHANNEL_EVENTS,
  SET_CHANNEL_EVENTS,
  DELETE_EVENT,
  UPDATE_CHANNEL_EVENT,
  UPDATE_EVENT,
  UPDATE_EVENT_USER_ASSISTENCE,
  EVENT_CLAIM_CREDIT,
  EVENT_CLAIM_ATTENDANCE,
  SET_ALL_EVENT_CHANNELS,
  GET_ALL_EVENTS_CHANNELS,
  VERIFY_SUSCRIBED_USER,
  SUSCRIBED_USER,
  SET_ONLY_ONE_EVENT
};

// ------------------------------------
// Actions
// ------------------------------------
export const getAllEvent = createAction(GET_ALL_EVENTS);
export const getMetadata = createAction(GET_METADATA, (metadata) => ({
  metadata,
}));
export const getLiveEvents = createAction(GET_LIVE_EVENTS);
export const getEvent = createAction(GET_EVENT, (id, callback) => ({
  id,
  callback,
}));
export const setAllEvents = createAction(SET_ALL_EVENTS, (events) => ({
  events,
}));
export const getAllEventsChannels = createAction(GET_ALL_EVENTS_CHANNELS, () => ({}))
export const setAllEventsChannels = createAction(SET_ALL_EVENT_CHANNELS, (eventsChannels) => ({
  eventsChannels
}))
export const setEvent = createAction(SET_EVENT, (event) => ({ event }));
export const setMetadata = createAction(SET_METADATA, (metadata) => ({
  metadata,
}));
export const setError = createAction(SET_ERROR, (error) => ({ error }));
export const setLoading = createAction(SET_LOADING, (loading) => ({ loading }));
export const addToMyEventList = createAction(
  ADD_TO_MY_EVENT_LIST,
  (event, userTimezone, callback) => ({
    event,
    userTimezone,
    callback,
  })
);
export const removeFromMyEventList = createAction(
  REMOVE_FROM_MY_EVENT_LIST,
  (event) => ({ event })
);
export const getMyEvents = createAction(GET_MY_EVENTS);
export const setMyEvents = createAction(SET_MY_EVENTS, (myEvents) => ({
  myEvents,
}));
export const setMyLiveEvents = createAction(SET_MY_LIVE_EVENTS, (myEvents) => ({
  myEvents,
}));
export const setMyLiveEvent = createAction(SET_MY_LIVE_EVENT, (event) => ({
  event,
}));
export const updateEventUserAssistence = createAction(
  UPDATE_EVENT_USER_ASSISTENCE,
  (payload) => ({
    payload,
  })
);

export const updateEventStatus = createAction(
  UPDATE_EVENT_STATUS,
  (event, status) => ({
    event,
    status,
  })
);
export const createChannelEvent = createAction(
  CREATE_CHANNEL_EVENT,
  (data, callback) => ({ data, callback })
);
export const getChannelEvents = createAction(GET_CHANNEL_EVENTS, (filter) => ({
  filter,
}));
export const setChannelEvents = createAction(
  SET_CHANNEL_EVENTS,
  (channelEvents) => ({ channelEvents })
);
export const deleteEvent = createAction(DELETE_EVENT, (event, callback) => ({
  event,
  callback,
}));
export const updateChannelEvent = createAction(
  UPDATE_CHANNEL_EVENT,
  (event, callback) => ({ event, callback })
);
export const updateEvent = createAction(UPDATE_EVENT, (id, callback) => ({
  id,
  callback,
}));
export const claimEventCredit = createAction(
  EVENT_CLAIM_CREDIT,
  (id, pdf, callback) => ({ id, pdf, callback })
);
export const claimEventAttendance = createAction(
  EVENT_CLAIM_ATTENDANCE,
  (id) => ({ id })
);

export const verifySuscribedUser = createAction(
  VERIFY_SUSCRIBED_USER,
  (callback) => ({ callback })
)

export const suscriptionSendingBlue = createAction(
  SUSCRIBED_USER,
  (callback) => ({ callback })
)

export const setOnlyOneEvent = createAction(
  SET_ONLY_ONE_EVENT,
  (event) => ({ event })
)

export const actions = {
  getAllEvent,
  getLiveEvents,
  getEvent,
  setAllEvents,
  getMetadata,
  setOnlyOneEvent,
  setMetadata,
  setEvent,
  suscriptionSendingBlue,
  setMyLiveEvents,
  updateEventUserAssistence,
  setMyLiveEvent,
  setError,
  setLoading,
  addToMyEventList,
  removeFromMyEventList,
  getMyEvents,
  setMyEvents,
  updateEventStatus,
  updateEvent,
  createChannelEvent,
  getChannelEvents,
  setChannelEvents,
  deleteEvent,
  updateChannelEvent,
  claimEventCredit,
  claimEventAttendance,
  setAllEventsChannels,
  getAllEventsChannels,
  verifySuscribedUser
};
