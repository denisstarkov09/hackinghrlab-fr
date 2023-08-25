import { handleActions } from "redux-actions";
import { Map } from "immutable";
import cloneDeep from "lodash/cloneDeep";

// Action Type Imports
import { constants as notificationConstants } from "../actions/notification-actions";

// Events's Reducer
export const reducers = {
  [notificationConstants.SET_NOTIFICATIONS]: (state, { payload }) => {
    const notificationList = state.get("notificationList");
    return state.merge({
      notificationList: cloneDeep(
        payload.currentPage === 1
          ? payload.notificationList
          : [
              ...notificationList,
              ...payload.notificationList.filter(
                (noti) => !notificationList.find((item) => item.id === noti.id)
              ),
            ]
      ),
      currentPage: payload.currentPage,
      countOfResults: payload.countOfResults,
      unreadCount: payload.countOfResults - payload.readCount,
    });
  },
  [notificationConstants.SET_NOTIFICATION_LOADING]: (state, { payload }) => {
    return state.merge({ ...payload });
  },
  [notificationConstants.SET_NOTIFICATION_MORE_LOADING]: (
    state,
    { payload }
  ) => {
    return state.merge({ moreLoading: payload.loading });
  },
  [notificationConstants.PUSH_NOTIFICATION]: (state, { payload }) => {
    const notificationList = state.get("notificationList");
    const countOfResults = state.get("countOfResults");
    const unreadCount = state.get("unreadCount");

    return state.merge({
      notificationList: [payload.data, ...notificationList],
      countOfResults: countOfResults + 1,
      unreadCount: unreadCount + 1,
    });
  },
  [notificationConstants.UPDATE_NOTIFICATION_TO_READ]: (state, { payload }) => {
    const notificationList = state.get("notificationList");

    return state.merge({
      notificationList: notificationList.map((noti) => ({
        ...noti,
        readers: (payload.notifications || []).includes(noti.id)
          ? [...noti.readers, payload.userId]
          : [...noti.readers],
      })),
      unreadCount: payload.unreadCount,
    });
  },
  [notificationConstants.UPDATE_NOTIFICATION_TO_UNREAD]: (
    state,
    { payload }
  ) => {
    const notificationList = state.get("notificationList");

    return state.merge({
      notificationList: notificationList.map((noti) => ({
        ...noti,
        readers: (payload.notifications || []).includes(noti.id)
          ? noti.readers.filter((id) => id !== payload.userId)
          : [...noti.readers],
      })),
      unreadCount: payload.unreadCount,
    });
  },
};

export const initialState = () =>
  Map({
    loading: false,
    moreLoading: false,
    notificationList: [],
    countOfResults: 0,
    currentPage: 1,
    unreadCount: 0,
  });

export default handleActions(reducers, initialState());
