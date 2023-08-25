import { handleActions } from "redux-actions";
import { Map } from "immutable";

import { constants as myLearningConstants } from "../actions/myLearning-actions";

const reducers = {
  [myLearningConstants.SET_ALL_SAVED]: (state, { payload }) => {
    return state.merge({
      allSaved: payload.allSaved,
    });
  },
  [myLearningConstants.SET_ALL_COMPLETED]: (state, { payload }) => {
    return state.merge({
      allCompleted: payload.allCompleted,
    });
  },
  [myLearningConstants.UPDATE_SAVE_FOR_LATER_LIBRARY]: (state, { payload }) => {
    const allSaved = state.get("allSaved");
    let newAllSaved = { ...allSaved };

    const newAllSavedIndex =
      newAllSaved &&
      newAllSaved.rows &&
      newAllSaved.rows.findIndex(
        (item) => item.id === payload.data.id && item.type === payload.data.type
      );

    if (newAllSavedIndex >= 0) {
      const filteredItem =
        newAllSaved?.rows?.filter(
          (item) =>
            item.id !== payload.data.id || item.type !== payload.data.type
        ) || [];

      newAllSaved.rows = filteredItem;
    }

    return state.merge({
      allSaved: newAllSaved,
    });
  },
  [myLearningConstants.UPDATE_COMPLETED_LIBRARY]: (state, { payload }) => {
    const allCompleted = state.get("allCompleted");
    let newAllCompleted = { ...allCompleted };

    const index =
      newAllCompleted &&
      newAllCompleted.rows &&
      newAllCompleted.rows.findIndex(
        (item) => item.id === payload.data.id && item.type === payload.data.type
      );

    if (index >= 0) {
      const filteredItem =
        newAllCompleted?.rows.filter(
          (item) =>
            item.id !== payload.data.id || item.type !== payload.data.type
        ) || [];

      newAllCompleted.rows = filteredItem;
    } else {
      newAllCompleted.rows = [payload.data, ...newAllCompleted.rows];
    }

    return state.merge({
      allCompleted: newAllCompleted,
    });
  },
  [myLearningConstants.SET_ALL_ITEMS_WITH_HR_CREDITS]: (state, { payload }) => {
    return state.merge({
      allItemsWithHRCredits: payload.items,
    });
  },
  [myLearningConstants.UPDATE_HR_CREDITS]: (state, { payload }) => {
    const allItemsWithHRCredits = state.get("allItemsWithHRCredits");
    const indx =
      allItemsWithHRCredits &&
      allItemsWithHRCredits.rows &&
      allItemsWithHRCredits.rows.findIndex((item) => item.id === payload.id);

    const transformAllItemsWithHRCredits = {
      ...allItemsWithHRCredits,
    };

    if (indx >= 0) {
      transformAllItemsWithHRCredits.rows[indx] = {
        ...payload.data,
      };
    }

    return state.merge({
      allItemsWithHRCredits: transformAllItemsWithHRCredits,
    });
  },
  [myLearningConstants.LEARNING_LOADING]: (state, { payload }) => {
    return state.merge({
      loading: payload.loading,
    });
  },
  [myLearningConstants.SET_MORE_ALL_ITEMS_WITH_HR_CREDITS]: (
    state,
    { payload }
  ) => {
    const allItemsWithHRCredits = state.get("allItemsWithHRCredits");

    allItemsWithHRCredits.rows = [
      ...allItemsWithHRCredits.rows,
      ...(payload.items.rows || []),
    ];

    return state.merge({
      allItemsWithHRCredits,
      allItemsWithHRCreditsCurrentPage: payload.page,
    });
  },
  [myLearningConstants.SET_ALL_EVENT_VIDEOS]: (state, { payload }) => {
    return state.merge({
      allEventVideos: payload.videos,
    });
  },
  [myLearningConstants.SET_LBRARIES]: (state, { payload }) => {
    return state.merge({
      allLibraries: payload.libraries,
    });
  },
  // [myLearningConstants.SET_MORE_EVENT_VIDEOS]: (state, { payload }) => {
  //   const allEventVideos = state.get("allEventVideos");

  //   allEventVideos.rows = [...allEventVideos.rows, ...payload.items.rows];

  //   return state.merge({
  //     allEventVideos,
  //     allEventVideosCurrentPage: payload.page,
  //   });
  // },
  [myLearningConstants.SET_MORE_COMPLETED]: (state, { payload }) => {
    const allCompleted = state.get("allCompleted");

    allCompleted.rows = [...allCompleted.rows, ...payload.items];

    return state.merge({
      allCompleted,
      allCompletedCurrentPage: payload.page,
    });
  },
  [myLearningConstants.SET_MORE_SAVED]: (state, { payload }) => {
    const allSaved = state.get("allSaved");

    allSaved.rows = [...allSaved.rows, ...payload.items];

    return state.merge({
      allSaved,
      allSavedCurrentPage: payload.page,
    });
  },
  [myLearningConstants.UPDATE_EVENT_VIDEOS]: (state, { payload }) => {
    const allEventVideos = state.get("allEventVideos");
    const newAllEventVideos = [...allEventVideos];

    const eventIndex = newAllEventVideos.findIndex(
      (event) => event.id === payload.data.EventId
    );

    if (eventIndex >= 0) {
      const libraryIndex = newAllEventVideos[eventIndex].Libraries.findIndex(
        (library) => library.id === payload.data.id
      );

      if (libraryIndex >= 0) {
        newAllEventVideos[eventIndex].Libraries[libraryIndex] = payload.data;
      }
    }

    return state.merge({
      allEventVideos: newAllEventVideos,
    });
  },
};

export const initialState = () => {
  return Map({
    allSaved: {},
    allCompleted: {},
    allItemsWithHRCredits: {},
    // allEventVideos: {},
    allEventVideos: [],
    allLibraries: [],
    allSavedCurrentPage: 1,
    allCompletedCurrentPage: 1,
    allItemsWithHRCreditsCurrentPage: 1,
    // allEventVideosCurrentPage: 1,
    // currentPage: 1,
    countOfResults: 0,
    loading: false,
  });
};

export default handleActions(reducers, initialState());
