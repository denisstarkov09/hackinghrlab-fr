import { put, fork, takeLatest, call } from "redux-saga/effects";
import groupBy from "lodash/groupBy";
import omit from "lodash/omit";

import {
  constants as sessionConstants,
  actions as sessionActions,
} from "../actions/session-actions";
import { logout } from "../actions/auth-actions";
import { actions as homeActions } from "../actions/home-actions";
import { actions as myLearningActions } from "redux/actions/myLearning-actions";
import {
  getAllSessions,
  getSessionsAddedbyUser,
  getSessionsUserJoined,
  getParticipants,
  getSession,
  getSessionClasses,
  recommendedAgenda,
  claimSession,
  saveForLaterSession,
  markSessionViewed,
} from "../../api";
import { notification } from "antd";

export function* getAllSessionsSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    let response = yield call(getAllSessions, { ...payload });

    if (response.status === 200) {
      const sessionData = Object.values(
        groupBy(response.data.conferences || [], "id")
      ).map((session) => {
        return session.reduce(
          (res, item) => ({
            ...res,
            ...omit(item, [
              "instructorid",
              "name",
              "image",
              "descriptionspeaker",
              "linkspeaker",
            ]),
            speakers: [
              ...(res.speakers || []),
              {
                id: item.instructorid,
                name: item.name,
                img: item.image,
                linkSpeaker: item.linkspeaker,
                description: item.descriptionspeaker,
              },
            ],
          }),
          {}
        );
      });
      yield put(sessionActions.setAllSessions(sessionData));
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
    yield put(sessionActions.setMessageError("No Available Sessions Found"));
  }
}

export function* getSessionSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getSession, payload);

    if (response.status === 200) {
      let sessionData
      if(payload.type === '2023'){
        sessionData = response.data.conference 
      }else{
        [sessionData] = Object.values(
          groupBy(response.data.conference || [], "id")
        ).map((session) => {
          return session.reduce(
            (res, item) => ({
              ...res,
              ...omit(item, [
                "instructorid",
                "name",
                "image",
                "descriptionspeaker",
                "linkspeaker",
              ]),
              speakers: [
                ...(res.speakers || []),
                {
                  id: item.instructorid,
                  name: item.name,
                  img: item.image,
                  linkSpeaker: item.linkspeaker,
                  description: item.descriptionspeaker,
                },
              ],
            }),
            {}
          );
        });
      }

      yield put(sessionActions.setSession(sessionData));
    }

    yield put(homeActions.setLoading(false));
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* getSessionClassesSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getSessionClasses, { ...payload });

    if (response.status === 200) {
      yield put(
        sessionActions.setSessionClasses(response.data.annualConferenceClasses)
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

export function* getSessionsAddedbyUserSaga({ payload }) {
  yield put(homeActions.setLoading(true));
  try {
    let response = yield call(getSessionsAddedbyUser, { ...payload });
    if (response.status === 200) {
      const sessionData = Object.values(
        groupBy(response.data.sessionsUser || [], "id")
      ).map((session) => {
        return session.reduce(
          (res, item) => ({
            ...res,
            ...omit(item, [
              "instructorid",
              "name",
              "image",
              "descriptionspeaker",
              "linkspeaker",
            ]),
            speakers: [
              ...(res.speakers || []),
              {
                id: item.instructorid,
                name: item.name,
                img: item.image,
                linkSpeaker: item.linkspeaker,
                description: item.descriptionspeaker,
              },
            ],
          }),
          {}
        );
      });

      yield put(sessionActions.setSessionsAddedByUser(sessionData));
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

export function* getSessionsUserJoinedSaga({ payload }) {
  yield put(homeActions.setLoading(true));
  try {
    let response = yield call(getSessionsUserJoined, { ...payload });
    if (response.status === 200) {
      const sessionData = Object.values(
        groupBy(response.data.sessionUserJoined || [], "id")
      ).map((session) => {
        return session.reduce(
          (res, item) => ({
            ...res,
            ...omit(item, [
              "instructorid",
              "name",
              "image",
              "descriptionspeaker",
              "linkspeaker",
            ]),
            speakers: [
              ...(res.speakers || []),
              {
                id: item.instructorid,
                name: item.name,
                img: item.image,
                linkSpeaker: item.linkspeaker,
                description: item.descriptionspeaker,
              },
            ],
          }),
          {}
        );
      });

      yield put(sessionActions.setSessionsUserJoined(sessionData));
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

export function* getParticipantsSaga({ payload }) {
  if (payload.page === 1) {
    yield put(homeActions.setLoading(true));
  } else {
    yield put(sessionActions.setSessionLoading(true));
  }

  try {
    let response = yield call(getParticipants, payload);
    if (response.status === 200) {
      yield put(sessionActions.setParticipants(response.data.participants));
    }
  } catch (error) {
    console.log(error);
    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
    yield put(sessionActions.setSessionLoading(false));
  }
}

export function* recommendedAgendaSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    let response = yield call(recommendedAgenda, { ...payload });

    if (response.status === 200) {
      const sessionData = Object.values(
        groupBy(response.data.recommendedAgenda || [], "id")
      ).map((session) => {
        return session.reduce(
          (res, item) => ({
            ...res,
            ...omit(item, [
              "instructorid",
              "name",
              "image",
              "descriptionspeaker",
              "linkspeaker",
            ]),
            speakers: [
              ...(res.speakers || []),
              {
                id: item.instructorid,
                name: item.name,
                img: item.image,
                linkSpeaker: item.linkspeaker,
                description: item.descriptionspeaker,
              },
            ],
          }),
          {}
        );
      });
      yield put(sessionActions.setRecommendedAgenda(sessionData));
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

export function* claimSessionSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(claimSession, { ...payload });

    if (response.status === 200) {
      if (payload.callback) {
        payload.callback("");
      }
    }
  } catch (error) {
    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    } else if (payload.callback) {
      payload.callback(
        error.response.data || "Something went wrong, Please try again."
      );
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* markSessionViewedSaga({ payload }) {
  try {
    const response = yield call(markSessionViewed, { ...payload });

    if (response.status === 200) {
      yield put(
        sessionActions.updateSessionViewed(
          response.data.affectedRows
          // payload.index
        )
      );
      yield put(
        myLearningActions.updateSaveForLaterLibrary(response.data.affectedRows)
      );
      yield put(
        myLearningActions.updateCompletedLibrary(response.data.affectedRows)
      );
      // yield put(
      //   myLearningActions.updateHRCredits(
      //     payload.id,
      //     response.data.affectedRows
      //   )
      // );
    }
  } catch (error) {
    console.log(error);
    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  }
}

export function* saveForLaterSessionSaga({ payload }) {
  try {
    const response = yield call(saveForLaterSession, { ...payload });

    if (response.status === 200) {
      yield put(
        sessionActions.updateSaveForLaterSession(response.data.affectedRows)
      );
      yield put(
        myLearningActions.updateSaveForLaterLibrary(response.data.affectedRows)
      );

      if (payload.isInHRCredits) {
        // yield put(
        //   myLearningActions.updateHRCredits(
        //     payload.id,
        //     response.data.affectedRows
        //   )
        // );
      }

      notification.success({
        message: "Success",
      });
    }
  } catch (error) {
    console.error(error);
    notification.error({
      message: "Error",
      description: "Something went wrong.",
    });

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  }
}

function* watchSession() {
  yield takeLatest(sessionConstants.GET_ALL_SESSIONS, getAllSessionsSaga);
  yield takeLatest(sessionConstants.GET_SESSION, getSessionSaga);
  yield takeLatest(sessionConstants.GET_SESSION_CLASSES, getSessionClassesSaga);
  yield takeLatest(
    sessionConstants.GET_SESSIONS_ADDED_BY_USER,
    getSessionsAddedbyUserSaga
  );
  yield takeLatest(
    sessionConstants.GET_SESSIONS_USER_JOINED,
    getSessionsUserJoinedSaga
  );
  yield takeLatest(sessionConstants.GET_PARTICIPANTS, getParticipantsSaga);
  yield takeLatest(sessionConstants.RECOMMENDED_AGENDA, recommendedAgendaSaga);
  yield takeLatest(sessionConstants.CLAIM_SESSION, claimSessionSaga);
  yield takeLatest(sessionConstants.SET_SESSION_VIEWED, markSessionViewedSaga);
  yield takeLatest(
    sessionConstants.SAVE_FOR_LATER_SESSION,
    saveForLaterSessionSaga
  );
}

export const sessionSaga = [fork(watchSession)];
