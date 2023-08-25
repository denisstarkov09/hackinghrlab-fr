import { put, fork, takeLatest, call } from "redux-saga/effects";
import { notification } from "antd";

import {
  constants as councilEventConstants,
  actions as councilEventActions,
} from "../actions/council-events-actions";
import {
  constants as councilConstants
} from '../actions/council-actions'
import { actions as homeActions } from "../actions/home-actions";
import {
  upsertCouncilEvent,
  getCouncilEvents,
  deleteCouncilEvent,
  joinCouncilEvent,
  removeCouncilEventPanelist,
  searchUserForCouncilEventPanelist,
  upsertCouncilEventPanelComment,
  joinCouncilAwaitEvent,
  exportsMembersCouncil,
  sendEmailsForPartOfCouncilEndPoint,
  addDraftEmailEventEndPoint,
  sendEmailAttendeeEventOwnerEndPoint,
  getAllDraftEmailEventEndPoint,
  deleteDraftEmailEventEndPoint,
  getAllSendEmailEventEndPoint,
} from "api";

export function* upsertCouncilEventSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(upsertCouncilEvent, payload.councilEvent);
    const isEdit = payload.councilEvent.id;

    if (response.status === 200) {
      yield put(
        councilEventActions.setUpsertCouncilEvent(
          response.data.councilEvent,
          isEdit
        )
      );
      notification.success({
        message: "Success",
      });

      if (payload.callback) {
        payload.callback();
      }
    }
  } catch (err) {
    console.log(err);
    payload.callback(err);
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* getCouncilEventsSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getCouncilEvents);

    if (response.status === 200) {
      if (payload.callback) {
        payload.callback(response.data.councilEvents)
      }
      yield put(
        councilEventActions.setCouncilEvents(response.data.councilEvents)
      );
    }
  } catch (err) {
    console.log(err);
    notification.error({
      message: "Something went wrong.",
    });
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* deleteCouncilEventSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(deleteCouncilEvent, payload.councilEventId);

    if (response.status === 200) {
      notification.success({
        message: "Success",
      });
      yield put(
        councilEventActions.setCouncilEvents(response.data.councilEvents)
      );
    }
  } catch (err) {
    console.log(err);
    notification.error({
      message: "Something went wrong.",
    });
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* joinCouncilEventSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(joinCouncilEvent, payload);

    if (response.status === 200) {

      if (payload.callback) {
        payload.callback();
      }

      notification.success({
        message: "Success",
      });
    } else if (response.status === 202) {
      notification.warn({
        message: response.data.msg,
      });
    }
  } catch (err) {
    console.log(err);
    notification.error({
      message: "Something went wrong.",
    });
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* removeCouncilEventPanelistSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(removeCouncilEventPanelist, payload);

    if (response.status === 200) {
      notification.success({
        message: "Success",
      });

      // yield put(
      //   councilEventActions.setJoinCouncilEvent(response.data.councilEventPanel)
      // );
    }
  } catch (err) {
    console.log(err);
    notification.error({
      message: "Something went wrong.",
    });
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* searchUserForCouncilEventPanelistSaga({ payload }) {
  try {
    const response = yield call(searchUserForCouncilEventPanelist, payload);

    if (response.status === 200) {
      yield put(
        councilEventActions.setSearchedUserForCouncilEventPanelist(
          response.data.users
        )
      );
    }
  } catch (err) {
    console.log(err);
    notification.error({
      message: "Something went wrong.",
    });
  }
}

export function* commentCouncilEventPanelSaga({ payload }) {
  try {
    const response = yield call(
      upsertCouncilEventPanelComment,
      payload.councilEventPanelComment
    );

    if (response.status === 200) {
      notification.success({
        message: "Success",
      });
    }
  } catch (err) {
    console.log(err);
    notification.error({
      message: "Something went wrong.",
    });
  }
}

export function* joinCouncilEventWaitSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(joinCouncilAwaitEvent, payload);

    if (response.status === 200) {

      if (payload.callback) {
        payload.callback();
      }

      notification.success({
        message: "Success",
      });
    } else if (response.status === 202) {
      notification.warn({
        message: response.data.msg,
      });
    }
  } catch (err) {
    console.log(err);
    notification.error({
      message: "Something went wrong.",
    });
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* downloadEventsWithParticipantsSagas({ payload }) {
  const { idEvent } = payload

  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(exportsMembersCouncil, { idEvent });

    if (response.status === 200) {
      yield put(homeActions.setLoading(false));
      var fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.ms-excel' }));
      var fileLink = document.createElement('a');

      fileLink.href = fileURL;
      fileLink.setAttribute('download', `council.xlsx`);
      document.body.appendChild(fileLink);

      fileLink.click();
      document.body.removeChild(fileLink);
      window.URL.revokeObjectURL(fileURL);
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
    } else if (payload.callback) {
      payload.callback("Something went wront. Please try again.");
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* sendEmailsForPartOfCouncilSagas({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(sendEmailsForPartOfCouncilEndPoint, payload.data);

    if (response.status === 200) {

      if (payload.callback) {
        payload.callback();
      }

      notification.success({
        message: "Success",
      });
    } else if (response.status === 202) {
      notification.warn({
        message: response.data.msg,
      });
    }
  } catch (err) {
    console.log(err);
    notification.error({
      message: "Something went wrong.",
    });
  } finally {
    yield put(homeActions.setLoading(false));
  }
}


export function* sendEmailAttendeeEventOwnerSagas({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(sendEmailAttendeeEventOwnerEndPoint, payload.data);

    if (response.status === 200) {

      yield put(homeActions.setLoading(false));

      if (payload.callback) {
        payload.callback();
        notification.info({
          description: 'Your email has been sent!',
        });
      }


    }
  } catch (error) {
    console.log(error);
    yield put(homeActions.setLoading(false));

    if (error && error.response && error.response.status === 401) {
    } else if (error.response.status === 400) {
      notification.error({
        description: error.response.data.message,
      });
    } else if (payload.callback) {
      payload.callback("Something went wront. Please try again.");
    }
  }
}

export function* addDraftEmailEventSagas({ payload }) {
  const { draftEmail } = payload
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(addDraftEmailEventEndPoint, { draftEmail });

    if (response.status === 200) {

      const { draftEmailResponse } = response.data;

      if (draftEmailResponse !== undefined) {
        yield put(
          councilEventActions.updateAllEmailEvent({
            draftEmailResponse,
            bul: true
          })
        );
      }

      if (payload.callback) {
        payload.callback();
      }
    }
  } catch (error) {
    console.log(error)
    if (error.response !== undefined) {
      if (error.response.data !== undefined) {
        if (error.response.data.msg !== undefined) {
          notification.error({
            message: "there are a error",
            description: error.response.data.msg,
          });
        }
      }
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* getAllDraftEmailEventSagas({ payload }) {
  const { id } = payload

  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getAllDraftEmailEventEndPoint, { id });
    if (response.status === 200) {
      const { draftEmailResponse } = response.data;

      yield put(
        councilEventActions.updateAllEmailEvent({
          draftEmailResponse,
          bul: false
        })
      );
    }
  } catch (error) {
    console.log(error)
    if (error.response !== undefined) {
      if (error.response.data !== undefined) {
        if (error.response.data.msg !== undefined) {
          notification.error({
            message: "there are a error",
            description: error.response.data.msg,
          });
        }
      }
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* deleteDraftEmailEventSagas({ payload }) {
  const { draftEmailId } = payload
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(deleteDraftEmailEventEndPoint, { draftEmailId });

    if (response.status === 200) {

      yield put(homeActions.setLoading(false));

      if (payload.callback) {
        payload.callback();
      }

      notification.success({
        message: "Email draft delete successflly",
      });

    }
  } catch (error) {
    console.log(error)
    if (error.response !== undefined) {
      if (error.response.data !== undefined) {
        if (error.response.data.msg !== undefined) {
          notification.error({
            message: "there are a error",
            description: error.response.data.msg,
          });
        }
      }
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* getAllSendEmailEventSagas({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getAllSendEmailEventEndPoint);
    if (response.status === 200) {
      const { sendEmailResponse } = response.data;

      yield put(
        councilEventActions.updateAllEmailEventSend({
          sendEmailResponse,
          bul: false
        })
      );
    }
  } catch (error) {
    console.log(error)
    if (error.response !== undefined) {
      if (error.response.data !== undefined) {
        if (error.response.data.msg !== undefined) {
          notification.error({
            message: "there are a error",
            description: error.response.data.msg,
          });
        }
      }
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

function* watchCouncilEvent() {
  yield takeLatest(
    councilEventConstants.UPSERT_COUNCIL_EVENT,
    upsertCouncilEventSaga
  );
  yield takeLatest(
    councilEventConstants.GET_COUNCIL_EVENTS,
    getCouncilEventsSaga
  );
  yield takeLatest(
    councilEventConstants.JOIN_COUNCIL_EVENT_WAIT,
    joinCouncilEventWaitSaga
  )
  yield takeLatest(
    councilEventConstants.DELETE_COUNCIL_EVENT,
    deleteCouncilEventSaga
  );
  yield takeLatest(
    councilEventConstants.JOIN_COUNCIL_EVENT,
    joinCouncilEventSaga
  );
  yield takeLatest(
    councilEventConstants.REMOVE_COUNCIL_EVENT_PANELIST,
    removeCouncilEventPanelistSaga
  );
  yield takeLatest(
    councilEventConstants.COUNCIL_EVENT_SEARCH_USER,
    searchUserForCouncilEventPanelistSaga
  );
  yield takeLatest(
    councilEventConstants.COUNCIL_EVENT_PANEL_COMMENT,
    commentCouncilEventPanelSaga
  );
  yield takeLatest(
    councilEventConstants.DOWNLOAD_EVENTS_WITH_PARTICIPANTS,
    downloadEventsWithParticipantsSagas
  )
  yield takeLatest(
    councilConstants.EMAIL_ADD,
    sendEmailsForPartOfCouncilSagas
  )
  yield takeLatest(councilEventConstants.SEND_EMAIL_ATTEND_EVENT_ADMIN, sendEmailAttendeeEventOwnerSagas)
  yield takeLatest(councilEventConstants.ADD_EMAIL_DRAFT_EVENT, addDraftEmailEventSagas);
  yield takeLatest(councilEventConstants.GET_ALL_EMAIL_DRAFT_EVENT, getAllDraftEmailEventSagas);
  yield takeLatest(councilEventConstants.DELETE_EMAIL_DRAFT_EVENT, deleteDraftEmailEventSagas);
  yield takeLatest(councilEventConstants.GET_ALL_EMAIL_SEND_EVENT, getAllSendEmailEventSagas);
}

export const councilEventSaga = [fork(watchCouncilEvent)];
