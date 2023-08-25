import { handleActions } from "redux-actions";
import { Map } from "immutable";
import cloneDeep from "lodash/cloneDeep";

// Action Type Imports
import { constants as homeConstants } from "../actions/home-actions";

// Home Page's Reducer
export const reducers = {
  [homeConstants.SET_LOADING]: (state, { payload }) => {
    return state.merge({ ...payload });
  },
  [homeConstants.SET_PLAN_UPDATED]: (state, { payload }) => {
    return state.merge({ ...payload });
  },
  [homeConstants.UPDATE_USER_INFO]: (state, { payload }) => {
    return state.merge({
      userProfile: cloneDeep(payload.userProfile),
    });
  },
  [homeConstants.SET_SETTING_COLLAPSED]: (state, { payload }) => {
    return state.merge({
      setting: {
        collapsed: { ...state.get("setting").collapsed, ...payload.collapsed },
      },
    });
  },
  [homeConstants.SET_USERS]: (state, { payload }) => {
    return state.merge({
      allUsers: cloneDeep([...payload.users]),
    });
  },
  [homeConstants.SET_ALL_COUNT_USERS]: (state, { payload }) => {
    return state.merge({
      userCount: payload.userCount,
    });
  },
  [homeConstants.SET_INPUT_USER_SEARCH_VALUE]: (state, { payload }) => {
    return state.merge({
      inputUserSearchValue: payload.value,
    });
  },
  [homeConstants.SET_LOADING_SEARCH_USERS]: (state, { payload }) => {
    return state.merge({
      loadingSearchUsers: payload.loading,
    });
  },
  [homeConstants.SET_SEARCHED_USERS]: (state, { payload }) => {
    return state.merge({
      searchedUsers: payload.searchUsers,
    });
  },
  [homeConstants.SET_USER_SHOW]: (state, { payload }) => {
    return state.merge({
      userShow: payload.userShow,
    });
  },
  [homeConstants.SET_VISIBLE_PROFILE_USER]: (state, { payload }) => {
    return state.merge({
      visibleProfileUser: payload.visibleProfileUser,
    });
  },
  [homeConstants.SET_PAGES_SEARCHED_USERS]: (state, { payload }) => {
    return state.merge({
      totalUsers: payload.count,
    });
  },
  [homeConstants.FIRST_REDIRECT]: (state, { payload }) => {
    return state.merge({
      firstRedirect: payload.bul,
    });
  },
  [homeConstants.SET_REDIRECT_FAST]: (state, { payload }) => {
    return state.merge({
      redirectHome: payload.bul,
    });
  }
};

export const initialState = () =>
  Map({
    loading: false,
    userProfile: {
      // firstName: "Edgar",
      // lastName: "Davis",
      // company: "",
      // abbrName: "ED",
      // img: null,
      // about: `Developing Talent & Leadership behaviors. Positive Design Thinking & Strategy through Positive Leadership Strategy and POSITIVE & AGILE coaching | 2 hack habits, goal achievement, and behavior transformation in organizations, sports clubs, PYMES, and corporations.`,
      // titleProfessions: "HR Management & Coaching",
      // proficiencyLevel: "",
      // topicsOfInterest: [],
      // personalLinks: {},
      // language: "",
      // timezone: "",
      // completed: false,
      // percentOfCompletion: 36,
    },
    redirectHome: false,
    setting: {
      collapsed: {
        mentor: false,
        mentee: false,
      },
    },
    allUsers: [],
    userCount: 0,
    inputUserSearchValue: "",
    loadingSearchUsers: false,
    searchedUsers: [],
    userShow: {},
    visibleProfileUser: false,
    totalUsers: 0,
    firstRedirect: false,
  });

export default handleActions(reducers, initialState());
