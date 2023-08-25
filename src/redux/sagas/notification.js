import { put, fork, takeLatest, call } from "redux-saga/effects";
import {
  constants as notificationConstants,
  actions as notificationActions,
} from "../actions/notification-actions";
import { logout } from "../actions/auth-actions";

import { getNotifications, markeToRead, markeToUnRead } from "../../api";
export function* getNotificationsSaga({ payload }) {
  if (payload.page === 1) {
    yield put(notificationActions.setNotificationLoading(true));
  } else {
    yield put(notificationActions.setNotificationMoreLoading(true));
  }

  try {
    const response = yield call(getNotifications, { ...payload });

    if (response.status === 200) {
      yield put(
        notificationActions.setNotifications(
          response.data.notifications.count,
          payload.page,
          response.data.notifications.rows,
          response.data.readCount
        )
      );
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  } finally {
    if (payload.page === 1) {
      yield put(notificationActions.setNotificationLoading(false));
    } else {
      yield put(notificationActions.setNotificationMoreLoading(false));
    }
  }
}

export function* setNotificationToReadSaga({ payload }) {
  try {
    const response = yield call(markeToRead, { ...payload });

    if (response.status === 200) {
      yield put(
        notificationActions.updateNotificationToRead(
          payload.notifications,
          response.data.unread,
          payload.userId
        )
      );
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  }
}

export function* setNotificationToUnReadSaga({ payload }) {
  try {
    const response = yield call(markeToUnRead, { ...payload });

    if (response.status === 200) {
      yield put(
        notificationActions.updateNotificationToUnRead(
          payload.notifications,
          response.data.unread,
          payload.userId
        )
      );
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  }
}

function* watchNotification() {
  yield takeLatest(
    notificationConstants.GET_NOTIFICATIONS,
    getNotificationsSaga
  );
  yield takeLatest(
    notificationConstants.MARK_NOTIFICATION_TO_READ,
    setNotificationToReadSaga
  );
  yield takeLatest(
    notificationConstants.MARK_NOTIFICATION_TO_UNREAD,
    setNotificationToUnReadSaga
  );
}

export const notificationSaga = [fork(watchNotification)];
