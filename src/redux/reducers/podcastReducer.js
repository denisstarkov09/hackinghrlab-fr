import { handleActions } from "redux-actions";
import { Map } from "immutable";
import cloneDeep from "lodash/cloneDeep";

// Action Type Imports
import { constants as podcastConstants } from "../actions/podcast-actions";

// Events's Reducer
export const reducers = {
  [podcastConstants.SET_ALL_PODCASTS]: (state, { payload }) => {
    if (payload.page === 1) {
      return state.merge({
        allEpisodes: cloneDeep(payload.podcasts),
        currentPage: payload.page,
        countOfResults: payload.total,
      });
    }
    const allEpisodes = state.get("allEpisodes");
    return state.merge({
      allEpisodes: cloneDeep([...allEpisodes, ...payload.podcasts]),
      currentPage: payload.page,
      countOfResults: payload.total,
    });
  },
  [podcastConstants.SET_ALL_PODCAST_SERIES]: (state, { payload }) => {
    return state.merge({ ...payload });
  },
  [podcastConstants.SET_PODCAST_SERIES]: (state, { payload }) => {
    return state.merge({ ...payload });
  },
  [podcastConstants.SET_LOADING]: (state, { payload }) => {
    return state.merge({ ...payload });
  },
  [podcastConstants.SET_FIRST_CHANNEL_PODCAST_LIST]: (state, { payload }) => {
    return state.merge({
      allEpisodes: cloneDeep([...payload.channelPodcasts]),
      currentPage: payload.page,
      countOfResults: payload.total,
    });
  },
  [podcastConstants.SET_MORE_CHANNEL_PODCAST_LIST]: (state, { payload }) => {
    const allEpisodes = state.get("allEpisodes");
    return state.merge({
      allEpisodes: cloneDeep([...allEpisodes, ...payload.channelPodcasts]),
      currentPage: payload.page,
      countOfResults: payload.total,
    });
  },
  [podcastConstants.UPDATE_PODCAST_VIEWED]: (state, { payload }) => {
    let allEpisodes = state.get("allEpisodes");
    const index = allEpisodes.findIndex(
      (episode) => episode.id === payload.data.id
    );

    if (index >= 0) {
      allEpisodes[index] = {
        ...payload.data,
      };
    }

    return state.merge({
      allEpisodes: cloneDeep([...allEpisodes]),
    });
  },
  [podcastConstants.UPDATE_PODCAST_SERIES_VIEWED]: (state, { payload }) => {
    let allPodcastSeries = state.get("allPodcastSeries");
    const index = allPodcastSeries.findIndex(
      (clibrary) => clibrary.id === payload.data.id
    );

    if (index >= 0) {
      allPodcastSeries[index] = {
        ...payload.data,
      };
    }

    return state.merge({
      allPodcastSeries: cloneDeep([...allPodcastSeries]),
    });
  },
  [podcastConstants.SET_PODCAST]: (state, { payload }) => {
    return state.merge({
      podcast: payload.data,
    });
  },
  [podcastConstants.UPDATE_SAVE_FOR_LATER_PODCAST]: (state, { payload }) => {
    const allEpisodes = state.get("allEpisodes");
    const index = allEpisodes.findIndex((item) => {
      return item.id === payload.data.id;
    });

    if (index >= 0) {
      allEpisodes[index] = {
        ...payload.data,
      };
    }

    return state.merge({
      allEpisodes: cloneDeep([...allEpisodes]),
    });
  },
  [podcastConstants.UPDATE_SAVE_FOR_LATER_PODCAST_SERIES]: (state, { payload }) => {
    const allPodcastSeries = state.get("allPodcastSeries");
    const index = allPodcastSeries.findIndex((item) => {
      return item.id === payload.data.id;
    });

    if (index >= 0) {
      allPodcastSeries[index] = {
        ...payload.data,
      };
    }

    return state.merge({
      allPodcastSeries: cloneDeep([...allPodcastSeries]),
    });
  },
};

export const initialState = () =>
  Map({
    loading: false,
    allEpisodes: [],
    allPodcastSeries: [],
    podcastSeries: {},
    countOfResults: 0,
    currentPage: 1,
    podcast: null,
  });

export default handleActions(reducers, initialState());
