import { createSelector } from "reselect";

const notificatioinDataSelector = (state) => state.notification;

const resultSelector = createSelector(notificatioinDataSelector, (payload) => {
  return {
    notificationList: payload.get("notificationList"),
    loading: payload.get("loading"),
    moreLoading: payload.get("moreLoading"),
    countOfResults: payload.get("countOfResults"),
    currentPage: payload.get("currentPage"),
    unreadCount: payload.get("unreadCount"),
  };
});

export const notificationSelector = (state) => ({
  ...resultSelector(state),
});
