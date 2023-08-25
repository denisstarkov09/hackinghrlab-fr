import { put, fork, takeLatest, call } from "redux-saga/effects";
import { notification } from "antd";

import {
  constants as conferenceConstants,
  actions as conferenceActions,
} from "../actions/conference-actions";
import { actions as homeActions } from "../actions/home-actions";
import { actions as myLearningActions } from "redux/actions/myLearning-actions";
import { logout } from "../actions/auth-actions";
import {
  searchConferenceLibrary,
  claimConferenceLibrary,
  markConferenceLibraryViewed,
  getConferenceLibrary,
  saveForLaterConference,
} from "../../api";

export function* getMoreConferenceLibrariesSaga({ payload }) {
  yield put(conferenceActions.setLoading(true));

  try {
    const response = yield call(searchConferenceLibrary, { ...payload });

    if (response.status === 200) {
      const moreConferenceLibraries = {
        libraries: response.data.conferences[0].rows,
        currentPage: payload.filter.page,
        count: response.data.conferences[0].count,
      };

      yield put(
        conferenceActions.setMoreConferenceLibraries(
          moreConferenceLibraries,
          payload.index
        )
      );
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  } finally {
    yield put(conferenceActions.setLoading(false));
  }
}

export function* searchConferenceLibrarySaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(searchConferenceLibrary, { ...payload });

    if (response.status === 200) {
      const allConferenceLibraries = response.data?.conferences?.map(
        (conference) => {
          return {
            ...conference,
            currentPage: 1,
          };
        }
      );

      yield put(
        conferenceActions.setSearchConferenceLibraries(allConferenceLibraries)
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

export function* claimConferenceLibrarySaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(claimConferenceLibrary, { ...payload });

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

export function* markConferenceLibraryViewedSaga({ payload }) {
  try {
    const response = yield call(markConferenceLibraryViewed, { ...payload });

    if (response.status === 200) {
      yield put(
        conferenceActions.updateConferenceLibraryViewed(
          response.data.affectedRows,
          payload.index
        )
      );
      yield put(
        myLearningActions.updateSaveForLaterLibrary(response.data.affectedRows)
      );
      yield put(
        myLearningActions.updateCompletedLibrary(response.data.affectedRows)
      );
      yield put(
        myLearningActions.updateHRCredits(
          payload.id,
          response.data.affectedRows
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

export function* getConferenceLibrarySaga({ payload }) {
  try {
    const response = yield call(getConferenceLibrary, { ...payload });

    if (response.status === 200) {
      yield put(
        conferenceActions.setConferenceLibrary(response.data.conference)
      );
    }
  } catch (error) {
    console.log(error);
    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  }
}

export function* saveForLaterConferenceSaga({ payload }) {
  try {
    const response = yield call(saveForLaterConference, { ...payload });

    if (response.status === 200) {
      yield put(
        conferenceActions.updateSaveForLaterConference(
          response.data.affectedRows,
          payload.yearIndex
        )
      );

      yield put(
        myLearningActions.updateSaveForLaterLibrary(response.data.affectedRows)
      );

      if (payload.isInHRCredits) {
        yield put(
          myLearningActions.updateHRCredits(
            payload.id,
            response.data.affectedRows
          )
        );
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

function* watchConference() {
  yield takeLatest(
    conferenceConstants.GET_MORE_CONFERENCE_LIBRARIES,
    getMoreConferenceLibrariesSaga
  );
  yield takeLatest(
    conferenceConstants.SEARCH_CONFERENCE_LIBRARIES,
    searchConferenceLibrarySaga
  );
  yield takeLatest(
    conferenceConstants.CLAIM_CONFERENCE_LIBRARY,
    claimConferenceLibrarySaga
  );
  yield takeLatest(
    conferenceConstants.SET_CONFERENCE_VIEWED,
    markConferenceLibraryViewedSaga
  );
  yield takeLatest(
    conferenceConstants.GET_CONFERENCE_LIBRARY,
    getConferenceLibrarySaga
  );
  yield takeLatest(
    conferenceConstants.SAVE_FOR_LATER_CONFERENCE,
    saveForLaterConferenceSaga
  );
}

export const conferenceSaga = [fork(watchConference)];
