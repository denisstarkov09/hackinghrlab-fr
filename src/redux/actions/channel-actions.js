import { createAction } from "redux-actions";

const CREATE_CHANNEL = "CREATE_CHANNEL";
const GET_CHANNEL = "GET_CHANNEL";
const SET_CHANNEL = "SET_CHANNEL";
const UPDATE_CHANNEL = "UPDATE_CHANNEL";
const DELETE_CHANNEL = "DELETE_CHANNEL";
const GET_FIRST_CHANNEL_LIST = "GET_FIRST_CHANNEL_LIST";
const SET_FIRST_CHANNEL_LIST = "SET_FIRST_CHANNEL_LIST";
const GET_MORE_CHANNEL_LIST = "GET_MORE_CHANNEL_LIST";
const SET_MORE_CHANNEL_LIST = "SET_MORE_CHANNEL_LIST";
const SET_FOLLOW_CHANNEL = "SET_FOLLOW_CHANNEL";
const UNSET_FOLLOW_CHANNEL = "UNSET_FOLLOW_CHANNEL";
const NOTIFY_NEW_INFORMATION_CREATOR = "NOTIFY_NEW_INFORMATION_CREATOR"
const GET_CHANNEL_FOR_NAME = "GET_CHANNEL_FOR_NAME";
const SET_CHANNEL_LOADING = "SET_CHANNEL_LOADING";
const SET_BUL_CHANNEL_PAGE = "SET_BUL_CHANNEL_PAGE";
const EXPORT_FOLLOWERS_CHANNELS = "EXPORT_FOLLOWERS_CHANNELS";
const SET_NEWS_CHANNEL_EDITOR = "SET_NEWS_CHANNEL_EDITOR";
const DELETE_CHANNEL_EDITOR = "DELETE_CHANNEL_EDITOR";
const SET_CHANNEL_EDITOR = "SET_CHANNEL_EDITOR";
const GET_CHANNEL_EDITOR = "GET_CHANNEL_EDITOR";
const SEND_EMAIL_ATTENDEE = "SEND_EMAIL_ATTENDEE";
const ADD_EMAIL_DRAFT = "ADD_EMAIL_DRAFT";
const GET_ALL_EMAIL_DRAFT = "GET_ALL_EMAIL_DRAFT";
const DELETE_EMAIL_DRAFT = "DELETE_EMAIL_DRAFT";
const EDIT_EMAIL_DRAFT = "EDIT_EMAIL_DRAFT";
const UPDATE_ALL_EMAIL_DRAFTS = "UPDATE_ALL_EMAIL_DRAFTS";
const UPDATE_ALL_EMAIL_SENDS = "UPDATE_ALL_EMAIL_SENDS";
const GET_ALL_EMAIL_SEND = "GET_ALL_EMAIL_SEND";
const COPY_EMAIL_SEND_CHANNEL = "COPY_EMAIL_SEND_CHANNEL";
const SET_CHANNEL_INVITATIONS = "SET_CHANNEL_INVITATIONS";

export const constants = {
  CREATE_CHANNEL,
  GET_CHANNEL,
  SET_CHANNEL,
  UPDATE_CHANNEL,
  DELETE_CHANNEL,
  GET_FIRST_CHANNEL_LIST,
  SET_FIRST_CHANNEL_LIST,
  GET_MORE_CHANNEL_LIST,
  SET_MORE_CHANNEL_LIST,
  SET_CHANNEL_LOADING,
  SET_FOLLOW_CHANNEL,
  UNSET_FOLLOW_CHANNEL,
  GET_CHANNEL_FOR_NAME,
  NOTIFY_NEW_INFORMATION_CREATOR,
  SET_BUL_CHANNEL_PAGE,
  EXPORT_FOLLOWERS_CHANNELS,
  SET_NEWS_CHANNEL_EDITOR,
  DELETE_CHANNEL_EDITOR,
  SET_CHANNEL_EDITOR,
  GET_CHANNEL_EDITOR,
  SEND_EMAIL_ATTENDEE,
  ADD_EMAIL_DRAFT,
  GET_ALL_EMAIL_DRAFT,
  DELETE_EMAIL_DRAFT,
  EDIT_EMAIL_DRAFT,
  UPDATE_ALL_EMAIL_DRAFTS,
  COPY_EMAIL_SEND_CHANNEL,
  GET_ALL_EMAIL_SEND,
  UPDATE_ALL_EMAIL_SENDS,
  SET_CHANNEL_INVITATIONS
};

// ------------------------------------
// Actions
// ------------------------------------
export const createChannel = createAction(
  CREATE_CHANNEL,
  (channel, callback) => ({
    channel,
    callback,
  })
);
export const getChannel = createAction(GET_CHANNEL, (id, callback) => ({
  id,
  callback,
}));
export const getChannelForName = createAction(GET_CHANNEL_FOR_NAME, (name, callback) => ({
  name,
  callback,
}));
export const setBulChannelPage = createAction(SET_BUL_CHANNEL_PAGE, (type) => ({
  type
}))
export const setChannel = createAction(SET_CHANNEL, (channel) => ({ channel }));
export const setOnlyInvitationsChannel = createAction(SET_CHANNEL_INVITATIONS, (invitations) => ({invitations}))
export const updateChannel = createAction(
  UPDATE_CHANNEL,
  (channel, callback) => ({
    channel,
    callback,
  })
);
export const notificationEmailToNewContentCreators = createAction(NOTIFY_NEW_INFORMATION_CREATOR, (chanelContent) => ({chanelContent}));
export const deleteChannel = createAction(DELETE_CHANNEL, (id) => ({ id }));
export const getFirstChannelList = createAction(
  GET_FIRST_CHANNEL_LIST,
  ({ filter, order, page, num }) => ({ filter, order, page, num })
);
export const setFirstChannelList = createAction(
  SET_FIRST_CHANNEL_LIST,
  (data, page, num) => ({ data, page, num })
);
export const getMoreChannelList = createAction(
  GET_MORE_CHANNEL_LIST,
  ({ filter, order, page, num }) => ({ filter, order, page, num })
);
export const setMoreChannelList = createAction(
  SET_MORE_CHANNEL_LIST,
  (data, page, num) => ({ data, page, num })
);
export const setChannelLoading = createAction(
  SET_CHANNEL_LOADING,
  (loading) => ({ loading })
);
export const setFollowChannel = createAction(
  SET_FOLLOW_CHANNEL,
  (channel, callback) => ({
    channel,
    callback,
  })
);

export const unsetFollowChannel = createAction(
  UNSET_FOLLOW_CHANNEL,
  (channel, callback) => ({
    channel,
    callback,
  })
);

export const downloadFollowersChannels = createAction(
  EXPORT_FOLLOWERS_CHANNELS,
  (idChannel) => ({idChannel})
)

export const setNewsChannelEditor = createAction(
  SET_NEWS_CHANNEL_EDITOR,
  (data, callback) => ({data, callback})
)

export const getChannelEditor = createAction(
  GET_CHANNEL_EDITOR,
  (id) => ({id})
)

export const deleteChannelEditor = createAction(
  DELETE_CHANNEL_EDITOR,
  (id, callback) => ({id, callback})
)

export const setChannelEditors = createAction(
  SET_CHANNEL_EDITOR,
  (channelEditor) => ({channelEditor})
)

export const sendEmailAttendeeChannelOwner = createAction(
  SEND_EMAIL_ATTENDEE,
  (data, callback) => ({data, callback})
)

export const addEmailDraftChannel = createAction(
  ADD_EMAIL_DRAFT,
  (draftEmail, callback) => ({draftEmail, callback})
)

export const getAllEmailDraftChannel = createAction(
  GET_ALL_EMAIL_DRAFT,
  (id,callback) => ({id,callback})
)

export const getAllEmailSendChannel = createAction(
  GET_ALL_EMAIL_SEND,
  (id,callback) => ({id,callback})
)

export const deleteEmailDraftChannel = createAction(
  DELETE_EMAIL_DRAFT,
  (draftEmailId, callback) => ({draftEmailId,  callback})
)

export const editEmailDraftChannel = createAction(
  EDIT_EMAIL_DRAFT,
  (draftEmail, callback) => ({draftEmail, callback})
)

export const copyEmailSendChannel = createAction(
  COPY_EMAIL_SEND_CHANNEL,
  (draftEmail, callback) => ({draftEmail, callback})
)

export const updateAllEmailChannel = createAction(
  UPDATE_ALL_EMAIL_DRAFTS,
  (draftEmailResponse) => ({draftEmailResponse})
)

export const updateAllEmailChannel2 = createAction(
  UPDATE_ALL_EMAIL_SENDS,
  (draftEmailResponse) => ({draftEmailResponse})
)

export const actions = {
  createChannel,
  getChannel,
  getChannelForName,
  setChannel,
  updateChannel,
  deleteChannel,
  getFirstChannelList,
  setFirstChannelList,
  getMoreChannelList,
  setMoreChannelList,
  setChannelLoading,
  setFollowChannel,
  unsetFollowChannel,
  notificationEmailToNewContentCreators,
  setOnlyInvitationsChannel,
  setBulChannelPage,
  downloadFollowersChannels,
  setNewsChannelEditor,
  deleteChannelEditor,
  setChannelEditors,
  getChannelEditor,
  sendEmailAttendeeChannelOwner,
  updateAllEmailChannel,
  addEmailDraftChannel,
  getAllEmailDraftChannel,
  deleteEmailDraftChannel,
  editEmailDraftChannel,
  copyEmailSendChannel,
  updateAllEmailChannel2,
  getAllEmailSendChannel,
};
