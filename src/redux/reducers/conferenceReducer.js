import { handleActions } from "redux-actions";
import { Map } from "immutable";
import cloneDeep from "lodash/cloneDeep";

// Action Type Imports
import { constants as conferenceConstants } from "../actions/conference-actions";

// Events's Reducer
export const reducers = {
  [conferenceConstants.SET_MORE_CONFERENCE_LIBRARIES]: (state, { payload }) => {
    const allConferenceLibraries = state.get("allConferenceLibraries");
    const libraries = payload.libraries;

    allConferenceLibraries[payload.index] = {
      rows: cloneDeep([
        ...allConferenceLibraries[payload.index].rows,
        ...libraries.libraries,
      ]),
      currentPage: libraries.currentPage,
      count: libraries.count,
    };

    return state.merge({
      allConferenceLibraries: cloneDeep([...allConferenceLibraries]),
    });
  },
  [conferenceConstants.SET_SEARCH_CONFERENCE_LIBRARIES]: (
    state,
    { payload }
  ) => {
    return state.merge({
      allConferenceLibraries: cloneDeep([...payload.libraries]),
    });
  },
  [conferenceConstants.SET_LOADING]: (state, { payload }) => {
    return state.merge({
      loading: payload.loading,
    });
  },
  [conferenceConstants.UPDATE_CONFERENCE_VIEWED]: (state, { payload }) => {
    let allConferenceLibraries = state.get("allConferenceLibraries");
    const index =
      allConferenceLibraries &&
      allConferenceLibraries[payload.index] &&
      allConferenceLibraries[payload.index].rows &&
      allConferenceLibraries[payload.index].rows.findIndex(
        (clibrary) => clibrary.id === payload.data.id
      );

    if (index >= 0) {
      allConferenceLibraries[payload.index].rows[index] = {
        ...payload.data,
      };
    }

    return state.merge({
      allConferenceLibraries: cloneDeep([...allConferenceLibraries]),
    });
  },
  [conferenceConstants.SET_CONFERENCE_LIBRARY]: (state, { payload }) => {
    return state.merge({
      conferenceLibrary: payload.data,
    });
  },
  [conferenceConstants.UPDATE_SAVE_FOR_LATER_CONFERENCE]: (
    state,
    { payload }
  ) => {
    const allConferenceLibraries = state.get("allConferenceLibraries");
    const index = allConferenceLibraries[payload.index]?.rows?.findIndex(
      (item) => {
        return item.id === payload.data.id;
      }
    );

    if (index >= 0) {
      allConferenceLibraries[payload.index].rows[index] = {
        ...payload.data,
      };
    }

    return state.merge({
      allConferenceLibraries: cloneDeep([...allConferenceLibraries]),
    });
  },
};

export const initialState = () =>
  Map({
    loading: false,
    error: null,
    allConferenceLibraries: [],
    conferenceLibrary: null,
  });

export default handleActions(reducers, initialState());
