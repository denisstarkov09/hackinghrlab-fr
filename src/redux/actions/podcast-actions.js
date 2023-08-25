import { createAction } from "redux-actions";

const GET_ALL_PODCASTS = "GET_ALL_PODCASTS";
const SET_ALL_PODCASTS = "SET_ALL_PODCASTS";
const GET_ALL_PODCAST_SERIES = "GET_ALL_PODCAST_SERIES";
const SET_ALL_PODCAST_SERIES = "SET_ALL_PODCAST_SERIES";
const GET_PODCAST_SERIES = "GET_PODCAST_SERIES";
const SET_PODCAST_SERIES = "SET_PODCAST_SERIES";
const SET_LOADING = "SET_PODCASTS_LOADING";
const ADD_PODCAST_TO_CHANNEL = "ADD_PODCAST_TO_CHANNEL";
const GET_FIRST_CHANNEL_PODCAST_LIST = "GET_FIRST_CHANNEL_PODCAST_LIST";
const SET_FIRST_CHANNEL_PODCAST_LIST = "SET_FIRST_CHANNEL_PODCAST_LIST";
const GET_MORE_CHANNEL_PODCAST_LIST = "GET_MORE_CHANNEL_PODCAST_LIST";
const SET_MORE_CHANNEL_PODCAST_LIST = "SET_MORE_CHANNEL_PODCAST_LIST";
const DELETE_CHANNEL_PODCAST = "DELETE_CHANNEL_PODCAST";
const UPDATE_CHANNEL_PODCAST = "UPDATE_CHANNEL_PODCAST";
const CLAIM_PODCAST_SERIES = "CLAIM_PODCAST_SERIES";
const SET_PODCAST_VIEWED = "SET_PODCAST_VIEWED";
const SET_PODCAST_SERIES_VIEWED = "SET_PODCAST_SERIES_VIEWED";
const UPDATE_PODCAST_VIEWED = "UPDATE_PODCAST_VIEWED";
const UPDATE_PODCAST_SERIES_VIEWED = "UPDATE_PODCAST_SERIES_VIEWED";
const GET_PODCAST = "GET_PODCAST";
const SET_PODCAST = "SET_PODCAST";
const SAVE_FOR_LATER_PODCAST = "SAVE_FOR_LATER_PODCAST";
const UPDATE_SAVE_FOR_LATER_PODCAST = "UPDATE_SAVE_FOR_LATER_PODCAST";
const SAVE_FOR_LATER_PODCAST_SERIES = "SAVE_FOR_LATER_PODCAST_SERIES";
const UPDATE_SAVE_FOR_LATER_PODCAST_SERIES =
  "UPDATE_SAVE_FOR_LATER_PODCAST_SERIES";

export const constants = {
  GET_ALL_PODCASTS,
  SET_ALL_PODCASTS,
  GET_ALL_PODCAST_SERIES,
  SET_ALL_PODCAST_SERIES,
  GET_PODCAST_SERIES,
  SET_PODCAST_SERIES,
  SET_LOADING,
  ADD_PODCAST_TO_CHANNEL,
  GET_FIRST_CHANNEL_PODCAST_LIST,
  SET_FIRST_CHANNEL_PODCAST_LIST,
  GET_MORE_CHANNEL_PODCAST_LIST,
  SET_MORE_CHANNEL_PODCAST_LIST,
  DELETE_CHANNEL_PODCAST,
  UPDATE_CHANNEL_PODCAST,
  CLAIM_PODCAST_SERIES,
  SET_PODCAST_VIEWED,
  SET_PODCAST_SERIES_VIEWED,
  UPDATE_PODCAST_VIEWED,
  UPDATE_PODCAST_SERIES_VIEWED,
  GET_PODCAST,
  SET_PODCAST,
  SAVE_FOR_LATER_PODCAST,
  UPDATE_SAVE_FOR_LATER_PODCAST,
  SAVE_FOR_LATER_PODCAST_SERIES,
  UPDATE_SAVE_FOR_LATER_PODCAST_SERIES,
};

// ------------------------------------
// Actions
// ------------------------------------
export const getAllPodcasts = createAction(GET_ALL_PODCASTS, (filter) => ({
  filter,
}));
export const setAllPodcasts = createAction(
  SET_ALL_PODCASTS,
  (total, page, podcasts) => ({
    total,
    page,
    podcasts,
  })
);
export const getAllPodcastSeries = createAction(
  GET_ALL_PODCAST_SERIES,
  (filter) => ({ filter })
);
export const setAllPodcastSeries = createAction(
  SET_ALL_PODCAST_SERIES,
  (allPodcastSeries) => ({ allPodcastSeries })
);
export const getPodcastSeries = createAction(GET_PODCAST_SERIES, (id) => ({
  id,
}));
export const setPodcastSeries = createAction(
  SET_PODCAST_SERIES,
  (podcastSeries) => ({ podcastSeries })
);
export const setLoading = createAction(SET_LOADING, (loading) => ({ loading }));
export const addPodcastToChannel = createAction(
  ADD_PODCAST_TO_CHANNEL,
  (podcast, callback) => ({ podcast, callback })
);

export const getFirstChannelPodcastList = createAction(
  GET_FIRST_CHANNEL_PODCAST_LIST,
  (filter) => ({ filter })
);
export const setFirstChannelPodcastList = createAction(
  SET_FIRST_CHANNEL_PODCAST_LIST,
  (total, page, channelPodcasts) => ({ total, page, channelPodcasts })
);
export const getMoreChannelPodcastList = createAction(
  GET_MORE_CHANNEL_PODCAST_LIST,
  (filter) => ({ filter })
);
export const setMoreChannelPodcastList = createAction(
  SET_MORE_CHANNEL_PODCAST_LIST,
  (total, page, channelPodcasts) => ({ total, page, channelPodcasts })
);
export const deleteChannelPodcast = createAction(
  DELETE_CHANNEL_PODCAST,
  (episode, callback) => ({ episode, callback })
);
export const updateChannelPodcast = createAction(
  UPDATE_CHANNEL_PODCAST,
  (episode, callback) => ({ episode, callback })
);
export const claimPodcastSeries = createAction(
  CLAIM_PODCAST_SERIES,
  (id, pdf, callback) => ({ id, pdf, callback })
);
export const setPodcastViewed = createAction(
  SET_PODCAST_VIEWED,
  (id, viewed) => ({
    id,
    viewed,
  })
);
export const setPodcastseriesViewed = createAction(
  SET_PODCAST_SERIES_VIEWED,
  (id, viewed) => ({
    id,
    viewed,
  })
);
export const updatePodcastViewed = createAction(
  UPDATE_PODCAST_VIEWED,
  (data) => ({ data })
);
export const updatePodcastseriesViewed = createAction(
  UPDATE_PODCAST_SERIES_VIEWED,
  (data) => ({ data })
);

export const getPodcast = createAction(GET_PODCAST, (id) => ({
  id,
}));

export const setPodcast = createAction(SET_PODCAST, (data) => ({
  data,
}));

export const saveForLaterPodcast = createAction(
  SAVE_FOR_LATER_PODCAST,
  (id, UserId, status) => ({ id, UserId, status })
);

export const updateSaveForLaterPodcast = createAction(
  UPDATE_SAVE_FOR_LATER_PODCAST,
  (data) => ({ data })
);

export const saveForLaterPodcastSeries = createAction(
  SAVE_FOR_LATER_PODCAST_SERIES,
  (id, UserId, status, isInHRCredits) => ({ id, UserId, status, isInHRCredits })
);

export const updateSaveForLaterPodcastSeries = createAction(
  UPDATE_SAVE_FOR_LATER_PODCAST_SERIES,
  (data) => ({ data })
);

export const actions = {
  getAllPodcasts,
  setAllPodcasts,
  getAllPodcastSeries,
  setAllPodcastSeries,
  getPodcastSeries,
  setPodcastSeries,
  setLoading,
  addPodcastToChannel,
  getFirstChannelPodcastList,
  setFirstChannelPodcastList,
  getMoreChannelPodcastList,
  setMoreChannelPodcastList,
  deleteChannelPodcast,
  updateChannelPodcast,
  claimPodcastSeries,
  setPodcastViewed,
  setPodcastseriesViewed,
  updatePodcastViewed,
  updatePodcastseriesViewed,
  getPodcast,
  setPodcast,
  saveForLaterPodcast,
  updateSaveForLaterPodcast,
  saveForLaterPodcastSeries,
  updateSaveForLaterPodcastSeries,
};
