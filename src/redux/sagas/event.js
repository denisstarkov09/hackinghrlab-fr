import { put, fork, takeLatest, call } from "redux-saga/effects";
import { notification } from "antd";
import moment from "moment";
import {
  getEventPeriod,
  getEventDescription,
  convertToCertainTime,
  convertToLocalTime
} from "utils/format";
import storage from "store";

import {
  constants as eventConstants,
  actions as eventActions,
} from "../actions/event-actions";
import { logout } from "../actions/auth-actions";
import { actions as homeActions } from "../actions/home-actions";
import {
  getAllEvents,
  getEvent,
  getLiveEventFromAPI,
  addToMyEventListFromAPI,
  removeFromMyEventListFromAPI,
  getAllMyEventsFromAPI,
  updateEventStatusFromAPI,
  updateEventFromAPI,
  createChannelEvent,
  getChannelEvents,
  deleteEvent,
  updateChannelEvent,
  claimEventCredit,
  claimEventAttendance,
  getMetadata,
  updateEventUserAssistenceFromAPI,
  getAllEventsChannelsEndPoint,
  verifySuscribedUserEndPoint,
  suscriptionSendingBlueEndPoint
} from "../../api";

const getEventStatus = (data, userId) => {
  let res = data.status[userId];

  const last = data.startAndEndTimes[data.startAndEndTimes.length - 1];

  if (res === "going") {
    res = moment().isBefore((last || {}).endTime) ? res : "past";
  } else if (!res) {
    res = moment().isBefore((last || {}).endTime) ? "attend" : "";
  }
  return res;
};

export function* getAllEventsSaga() {
  yield put(homeActions.setLoading(true));
  yield put(eventActions.setError(""));

  try {
    const response = yield call(getAllEvents);

    if (response.status === 200) {
      const community = storage.get("community");
      const { id: userId } = community || {};
      yield put(
        eventActions.setAllEvents(
          response.data.events
            .map((item) => ({
              ...item,
              key: item.id,
              date: moment(item.startDate).utc().format("YYYY.MM.DD h:mm a"),
              date2: moment(item.endDate).utc().format("YYYY.MM.DD h:mm a"),
              period: getEventPeriod(
                item.startDate,
                item.endDate,
                item.timezone
              ),
              period2: `${convertToLocalTime(item?.startDate, item?.timezone).format("MMMM DD, YYYY")} - ${convertToLocalTime(item?.endDate, item?.timezone).format("MMMM DD, YYYY")}`,
              about: getEventDescription(item.description),
              status: getEventStatus(item, userId),
            }))
            .sort((a, b) => {
              return moment(a.startDate).isAfter(moment(b.startDate)) ? 1 : -1;
            })
        )
      );
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    } else {
      const { msg } = error?.response?.data || {};
      yield put(eventActions.setError(msg));
      notification.error({
        message: "Cannot read all the events.",
        description: msg,
      });
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* getEventSaga({ payload }) {
  yield put(homeActions.setLoading(true));
  try {
    const response = yield call(getEvent, { ...payload });

    if (response.status === 200) {
      const community = storage.get("community");
      const { id: userId } = community || {};
      const { event } = response.data;
      yield put(
        eventActions.setOnlyOneEvent(
          event
        )
      )
      yield put(
        eventActions.setEvent({
          ...event,
          date: convertToCertainTime(event.startDate, event.timezone).format(
            "YYYY.MM.DD h:mm a"
          ),
          date2: convertToCertainTime(event.endDate, event.timezone).format(
            "YYYY.MM.DD h:mm a"
          ),
          period: getEventPeriod(
            event.startDate,
            event.endDate,
            event.timezone
          ),
          period2: `${convertToLocalTime(event?.startDate, event?.timezone).format("MMMM DD, YYYY")} - ${convertToLocalTime(event?.endDate, event?.timezone).format("MMMM DD, YYYY")}`,
          about: getEventDescription(event.description),
          status: getEventStatus(event, userId),
        })
      );
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    } else if (payload.callback) {
      payload.callback(true);
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* getAllEventsChannelsSagas({ payload }) {
  yield put(homeActions.setLoading(true));
  yield put(eventActions.setError(""));

  try {
    const response = yield call(getAllEventsChannelsEndPoint);
    if (response.status === 200) {

      yield put(
        eventActions.setAllEventsChannels(
          response.data.allEventsChannels
            .map((item) => ({
              ...item,
              key: item.id,
              date: moment(item.startDate).utc().format("YYYY.MM.DD h:mm a"),
              date2: moment(item.endDate).utc().format("YYYY.MM.DD h:mm a"),
              period: getEventPeriod(
                item.startDate,
                item.endDate,
                item.timezone
              ),
              period2: `${convertToLocalTime(item?.startDate, item?.timezone).format("MMMM DD, YYYY")} - ${convertToLocalTime(item?.endDate, item?.timezone).format("MMMM DD, YYYY")}`,
              about: getEventDescription(item.description),
            }))
            .sort((a, b) => {
              return moment(a.startDate).isAfter(moment(b.startDate)) ? 1 : -1;
            })
        )
      );
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    } else {
      const { msg } = error?.response?.data || {};
      yield put(eventActions.setError(msg));
      notification.error({
        message: "Cannot read all the events.",
        description: msg,
      });
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* getLiveEventSaga() {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getLiveEventFromAPI);
    if (response.status === 200) {
      const community = storage.get("community");
      const { id: userId } = community || {};
      const { events } = response.data;
      yield put(
        eventActions.setMyLiveEvents(
          events
            .map((item) => ({
              ...item,
              key: item.id,
              date: moment(item.startDate).utc().format("YYYY.MM.DD h:mm a"),
              date2: moment(item.endDate).utc().format("YYYY.MM.DD h:mm a"),
              period: getEventPeriod(
                item.startDate,
                item.endDate,
                item.timezone
              ),
              period2: `${convertToLocalTime(item?.startDate, item?.timezone).format("MMMM DD, YYYY")} - ${convertToLocalTime(item?.endDate, item?.timezone).format("MMMM DD, YYYY")}`,
              about: getEventDescription(item.description),
              status: getEventStatus(item, userId),
            }))
            .sort((a, b) => {
              return moment(a.startDate).isAfter(moment(b.startDate)) ? 1 : -1;
            })
        )
      );
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* addToMyEventList({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(addToMyEventListFromAPI, { ...payload });

    if (response.status === 200) {
      const data = response.data.affectedRows;
      const community = storage.get("community");
      const { id: userId } = community || {};
      yield put(
        eventActions.setEvent({
          ...data,
          date: moment(data.startDate).utc().format("YYYY.MM.DD h:mm a"),
          date2: moment(data.endDate).utc().format("YYYY.MM.DD h:mm a"),
          period: getEventPeriod(data.startDate, data.endDate, data.timezone),
          period2: `${convertToLocalTime(data?.startDate, data?.timezone).format("MMMM DD, YYYY")} - ${convertToLocalTime(data?.endDate, data?.timezone).format("MMMM DD, YYYY")}`,
          about: getEventDescription(data.description),
          status: getEventStatus(data, userId),
        })
      );

      if (payload.callback) {
        payload.callback(getEventStatus(data, userId));
      }
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* removeFromMyEventList({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(removeFromMyEventListFromAPI, { ...payload });

    if (response.status === 200) {
      const data = response.data.affectedRows;
      const community = storage.get("community");
      const { id: userId } = community || {};
      yield put(
        eventActions.setEvent({
          ...data,
          date: convertToCertainTime(data.startDate, data.timezone).format(
            "YYYY.MM.DD h:mm a"
          ),
          date2: convertToCertainTime(data.endDate, data.timezone).format(
            "YYYY.MM.DD h:mm a"
          ),
          period: getEventPeriod(data.startDate, data.endDate, data.timezone),
          period2: `${convertToLocalTime(data?.startDate, data?.timezone).format("MMMM DD, YYYY")} - ${convertToLocalTime(data?.endDate, data?.timezone).format("MMMM DD, YYYY")}`,
          about: getEventDescription(data.description),
          status: getEventStatus(data, userId),
        })
      );
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* getAllMyEvents() {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getAllMyEventsFromAPI);

    if (response.status === 200) {
      const community = storage.get("community");
      const { id: userId } = community || {};
      yield put(
        eventActions.setMyEvents(
          response.data.myEvents.map((item) => ({
            ...item,
            key: item.id,
            date: convertToCertainTime(item.startDate, item.timezone).format(
              "YYYY.MM.DD h:mm a"
            ),
            date2: convertToCertainTime(item.endDate, item.timezone).format(
              "YYYY.MM.DD h:mm a"
            ),
            period: getEventPeriod(item.startDate, item.endDate, item.timezone),
            period2: `${convertToLocalTime(item?.startDate, item?.timezone).format("MMMM DD, YYYY")} - ${convertToLocalTime(item?.endDate, item?.timezone).format("MMMM DD, YYYY")}`,
            about: getEventDescription(item.description),
            status: getEventStatus(item, userId),
          }))
        )
      );
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* getMetadataSagas({ payload }) {
  try {
    const response = yield call(getMetadata, { ...payload });
    if (response.status === 200) {
      yield put(eventActions.setMetadata({ metadata: response.data }));
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* updateEventStatus({ payload }) {
  yield put(homeActions.setLoading(true));
  try {
    const response = yield call(updateEventStatusFromAPI, { ...payload });

    if (response.status === 200) {
      const data = response.data.affectedRows;
      const community = storage.get("community");
      const { id: userId } = community || {};
      yield put(
        eventActions.setEvent({
          ...data,
          date: convertToCertainTime(data.startDate, data.timezone).format(
            "YYYY.MM.DD h:mm a"
          ),
          date2: convertToCertainTime(data.endDate, data.timezone).format(
            "YYYY.MM.DD h:mm a"
          ),
          period: getEventPeriod(data.startDate, data.endDate, data.timezone),
          period2: `${convertToLocalTime(data?.startDate, data?.timezone).format("MMMM DD, YYYY")} - ${convertToLocalTime(data?.endDate, data?.timezone).format("MMMM DD, YYYY")}`,
          about: getEventDescription(data.description),
          status: getEventStatus(data, userId),
        })
      );
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* updateEvent({ payload }) {
  yield put(homeActions.setLoading(true));
  try {
    const response = yield call(updateEventFromAPI, { ...payload });

    if (response.status === 200) {
      const data = response.data.affectedRows;
      yield put(
        eventActions.setEvent({
          ...data,
          date: convertToCertainTime(data.startDate, data.timezone).format(
            "YYYY.MM.DD h:mm a"
          ),
          date2: convertToCertainTime(data.endDate, data.timezone).format(
            "YYYY.MM.DD h:mm a"
          ),
          period: getEventPeriod(data.startDate, data.endDate, data.timezone),
          period2: `${convertToLocalTime(data?.startDate, data?.timezone).format("MMMM DD, YYYY")} - ${convertToLocalTime(data?.endDate, data?.timezone).format("MMMM DD, YYYY")}`,
          about: getEventDescription(data.description),
          usersAssistence: data.usersAssistence,
        })
      );
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* updateEventUserAssistenceSagas({ payload }) {
  yield put(homeActions.setLoading(true));
  try {
    const response = yield call(updateEventUserAssistenceFromAPI, {
      ...payload.payload,
    });
    if (response.status === 200) {
      const event = response.data.affectedRows;
      yield put(
        eventActions.setEvent({
          ...event,
          date: convertToCertainTime(event.startDate, event.timezone).format(
            "YYYY.MM.DD h:mm a"
          ),
          date2: convertToCertainTime(event.endDate, event.timezone).format(
            "YYYY.MM.DD h:mm a"
          ),
          period: getEventPeriod(
            event.startDate,
            event.endDate,
            event.timezone
          ),
          period2: `${convertToLocalTime(event?.startDate, event?.timezone).format("MMMM DD, YYYY")} - ${convertToLocalTime(event?.endDate, event?.timezone).format("MMMM DD, YYYY")}`,
          about: getEventDescription(event.description),
        })
      );
      notification.success({
        message: `Thank you for confirming your participation to ${event?.title}`,
      });
    }
  } catch (error) {
    notification.error({
      message: "Error updating user participate.",
    });
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* createChannelEventSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(createChannelEvent, { ...payload });

    if (response.status === 200) {
      if (payload.callback) {
        payload.callback("");
      }
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    } else if (payload.callback) {
      payload.callback("Something went wrong. Please try again.");
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* getChannelEventsSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getChannelEvents, { ...payload });

    if (response.status === 200) {
      const community = storage.get("community");
      const { id: userId } = community || {};
      const { channelEvents } = response.data;

      yield put(
        eventActions.setChannelEvents(
          channelEvents
            .map((item) => ({
              ...item,
              key: item.id,
              date: convertToCertainTime(item.startDate, item.timezone).format(
                "YYYY.MM.DD h:mm a"
              ),
              date2: convertToCertainTime(item.endDate, item.timezone).format(
                "YYYY.MM.DD h:mm a"
              ),
              period: getEventPeriod(
                item.startDate,
                item.endDate,
                item.timezone
              ),
              period2: `${convertToLocalTime(item?.startDate, item?.timezone).format("MMMM DD, YYYY")} - ${convertToLocalTime(item?.endDate, item?.timezone).format("MMMM DD, YYYY")}`,
              about: getEventDescription(item.description),
              status: getEventStatus(item, userId),
            }))
            .sort((a, b) => {
              return moment(a.startDate).isAfter(moment(b.startDate)) ? 1 : -1;
            })
        )
      );
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* deleteEventSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(deleteEvent, { ...payload });

    if (response.status === 200 && payload.callback) {
      payload.callback("");
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    } else if (payload.callback) {
      payload.callback("Something went wrong. Please try again.");
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* updateChannelEventSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(updateChannelEvent, { ...payload });

    if (response.status === 200) {
      if (payload.callback) {
        payload.callback("");
      }
    }
  } catch (error) {
    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    } else if (payload.callback) {
      if (error?.response?.data?.msg === undefined) {
        payload.callback(
          error?.response?.data || "Something went wrong, Please try again."
        );
      } else {
        payload.callback(
          error?.response?.data?.msg || "Something went wrong, Please try again."
        );
      }
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* claimEventCreditSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(claimEventCredit, { ...payload });

    if (response.status === 200) {
      if (payload.callback) {
        payload.callback("");
      }
    }
  } catch (error) {
    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    } else if (payload.callback) {
      if (error?.response?.data?.msg === undefined) {
        payload.callback(
          error?.response?.data || "Something went wrong, Please try again."
        );
      } else {
        payload.callback(
          error?.response?.data?.msg || "Something went wrong, Please try again."
        );
      }
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* claimEventAttendanceSaga({ payload }) {
  try {
    yield call(claimEventAttendance, { ...payload });
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* verifySuscribedUserSagas({ payload }) {
  try {
    const response = yield call(verifySuscribedUserEndPoint);

    if (response.status === 200) {
      if (payload.callback) {
        payload.callback(response.data)
      }
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* suscriptionSendingBlueSagas({ payload }) {
  try {
    const response = yield call(suscriptionSendingBlueEndPoint);

    if (response.status === 200) {
      if (payload.callback) {
        payload.callback()
      }
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

function* watchLogin() {
  yield takeLatest(eventConstants.GET_ALL_EVENTS, getAllEventsSaga);
  yield takeLatest(eventConstants.GET_METADATA, getMetadataSagas);
  yield takeLatest(eventConstants.GET_LIVE_EVENTS, getLiveEventSaga);
  yield takeLatest(eventConstants.GET_EVENT, getEventSaga);
  yield takeLatest(eventConstants.ADD_TO_MY_EVENT_LIST, addToMyEventList);
  yield takeLatest(
    eventConstants.REMOVE_FROM_MY_EVENT_LIST,
    removeFromMyEventList
  );
  yield takeLatest(eventConstants.GET_MY_EVENTS, getAllMyEvents);
  yield takeLatest(eventConstants.UPDATE_EVENT_STATUS, updateEventStatus);
  yield takeLatest(eventConstants.UPDATE_EVENT, updateEvent);
  yield takeLatest(
    eventConstants.UPDATE_EVENT_USER_ASSISTENCE,
    updateEventUserAssistenceSagas
  );
  yield takeLatest(eventConstants.CREATE_CHANNEL_EVENT, createChannelEventSaga);
  yield takeLatest(eventConstants.GET_CHANNEL_EVENTS, getChannelEventsSaga);
  yield takeLatest(eventConstants.DELETE_EVENT, deleteEventSaga);
  yield takeLatest(eventConstants.UPDATE_CHANNEL_EVENT, updateChannelEventSaga);
  yield takeLatest(eventConstants.EVENT_CLAIM_CREDIT, claimEventCreditSaga);
  yield takeLatest(
    eventConstants.EVENT_CLAIM_ATTENDANCE,
    claimEventAttendanceSaga
  );
  yield takeLatest(eventConstants.GET_ALL_EVENTS_CHANNELS, getAllEventsChannelsSagas)
  yield takeLatest(eventConstants.VERIFY_SUSCRIBED_USER, verifySuscribedUserSagas);
  yield takeLatest(eventConstants.SUSCRIBED_USER, suscriptionSendingBlueSagas)
}

export const eventSaga = [fork(watchLogin)];
