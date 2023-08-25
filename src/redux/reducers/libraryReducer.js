import { handleActions } from "redux-actions";
import { Map } from "immutable";
import cloneDeep from "lodash/cloneDeep";

// Action Type Imports
import { constants as libraryConstants } from "../actions/library-actions";

// Events's Reducer
export const reducers = {
  [libraryConstants.SET_MORE_LIBRARIES]: (state, { payload }) => {
    const allLibraries = state.get("allLibraries");
    return state.merge({
      allLibraries: cloneDeep([...allLibraries, ...payload.libraries]),
      currentPage: payload.currentPage,
      countOfResults: payload.countOfResults,
    });
  },
  [libraryConstants.SET_LIBRARY]: (state, { payload }) => {
    const allLibraries = state.get("allLibraries");
    let index = allLibraries.findIndex(
      (item) => item.id === payload.library.id
    );
    if (index >= 0) {
      allLibraries[index] = payload.library;
    }
    return state.merge({
      allLibraries: [...allLibraries],
      selectedLibrary: { ...payload.library },
    });
  },
  [libraryConstants.SET_SEARCH_LIBRARIES]: (state, { payload }) => {
    return state.merge({
      allLibraries: cloneDeep([...payload.libraries]),
      currentPage: payload.currentPage,
      countOfResults: payload.countOfResults,
    });
  },
  [libraryConstants.SET_LOADING]: (state, { payload }) => {
    return state.merge({
      loading: payload.loading,
    });
  },
  [libraryConstants.SET_RECOMMENDATIONS]: (state, { payload }) => {
    return state.merge({
      recommendations: payload.libraries,
    });
  },
  [libraryConstants.SET_FIRST_CHANNEL_LIBRARY_LIST]: (state, { payload }) => {
    return state.merge({
      allLibraries: cloneDeep([...payload.channelLibraries]),
      currentPage: payload.page,
      countOfResults: payload.total,
    });
  },
  [libraryConstants.SET_FIRST_CHANNEL_LIBRARY_LIST_HOME]: (state, { payload }) => {
    return state.merge({
      allLibrariesArticle: cloneDeep([...payload.channelLibraries]),
      currentPagueArticle: payload.page,
      countOfResultsArticle: payload.total,
    });
  },
  [libraryConstants.SET_MORE_CHANNEL_LIBRARY_LIST]: (state, { payload }) => {
    const allLibraries = state.get("allLibraries");
    return state.merge({
      allLibraries: cloneDeep([...allLibraries, ...payload.channelLibraries]),
      currentPage: payload.page,
      countOfResults: payload.total,
    });
  },
  [libraryConstants.UPDATE_LIBRARY_VIEWED]: (state, { payload }) => {
    let allLibraries = state.get("allLibraries");
    const index = allLibraries.findIndex((item) => item.id === payload.data.id);

    if (index >= 0) {
      allLibraries[index] = {
        ...payload.data,
      };
    }

    return state.merge({
      allLibraries: cloneDeep([...allLibraries]),
    });
  },
  [libraryConstants.SET_ALL_COMPLETED_LIBRARY]: (state, { payload }) => {
    return state.merge({
      allCompletedLibraries: cloneDeep([...payload.allCompletedLibraries]),
      currentPage: payload.currentPage,
      countOfResults: payload.countOfResults
    });
  },
  [libraryConstants.SET_MORE_COMPLETED_LIBRARY]: (state, { payload }) => {
    const allCompletedLibraries = state.get("allCompletedLibraries")

    return state.merge({
      allCompletedLibraries: cloneDeep([
        ...allCompletedLibraries,
        ...payload.allCompletedLibraries
      ]),
      currentPage: payload.currentPage,
      countOfResults: payload.countOfResults
    })
  },
  [libraryConstants.SET_SAVE_FOR_LATER]: (state, { payload }) => {
    return state.merge({
      allSaveForLaterLibraries: payload.allSaveForLaterLibraries
    })
  },
  [libraryConstants.UPDATE_LIBRARY_SAVE_FOR_LATER]: (state, { payload }) => {
    const allLibraries = state.get("allLibraries")

    const index = allLibraries.findIndex((item) => item.id === payload.data.id)

    if (index >= 0) {
      allLibraries[index] = {
        ...payload.data
      }
    }

    return state.merge({
      allLibraries: cloneDeep([ ...allLibraries ])
    })
  }
};

export const initialState = () =>
  Map({
    loading: false,
    error: null,
    allLibraries: [],
    countOfResults: 0,
    currentPage: 1,
    selectedLibrary: {},
    recommendations: {},
    allCompletedLibraries: [],
    allSaveForLaterLibraries: [],
    allLibrariesArticle: [],
    countOfResultsArticle: 0,
    currentPagueArticle: 1,
  });

export default handleActions(reducers, initialState());
